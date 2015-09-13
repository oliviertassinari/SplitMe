'use strict';

const Immutable = require('immutable');

const polyglot = require('polyglot');
const expenseUtils = require('Main/Expense/utils');

const accountUtils = {
  getMemberBalanceEntry: function(member, currency) {
    return member.get('balances').findEntry(function(value) {
      return value.get('currency') === currency;
    });
  },
  getNameMember: function(member) {
    if (member.get('id') === '0') {
      return polyglot.t('me');
    } else {
      // add displayName for backward compatibility
      return member.get('name') || member.get('displayName');
    }
  },
  getNameAccount: function(account) {
    let name = account.get('name');

    if (name === '') {
      for (let i = 1; i < Math.min(account.get('members').size, 4); i++) {
        name += account.getIn(['members', i, 'name']) + ', ';
      }
      name = name.substring(0, name.length - 2);
    }

    return name;
  },
  getMemberBalance: function(member, currency) {
    return member.get('balances').find(function(item) {
        return item.get('currency') === currency;
      });
  },
  getAccountMember: function(account, memberId) {
    return account.get('members').findEntry(function(value) {
      return value.get('id') === memberId;
    });
  },
  applyTransfersToAccount: function(account, transfers, inverse) {
    if (!inverse) {
      inverse = false; // Boolean
    }

    function addEmptyBalanceToAccount(currency, list) {
      return list.push(Immutable.fromJS({
        currency: currency,
        value: 0,
      }));
    }

    function updateValue(toAdd, number) {
      return number + toAdd;
    }

    return account.withMutations(function(accountMutable) {
      for (let i = 0; i < transfers.length; i++) {
        const transfer = transfers[i];

        let memberFrom = accountUtils.getAccountMember(accountMutable, transfer.from);
        let memberTo = accountUtils.getAccountMember(accountMutable, transfer.to);

        let memberFromBalance = accountUtils.getMemberBalanceEntry(memberFrom[1], transfer.currency);

        if (!memberFromBalance) {
          accountMutable.updateIn(['members', memberFrom[0], 'balances'],
            addEmptyBalanceToAccount.bind(this, transfer.currency));
          memberFrom = accountUtils.getAccountMember(accountMutable, transfer.from);
          memberFromBalance = accountUtils.getMemberBalanceEntry(memberFrom[1], transfer.currency);
        }

        let memberToBalance = accountUtils.getMemberBalanceEntry(memberTo[1], transfer.currency);

        if (!memberToBalance) {
          accountMutable.updateIn(['members', memberTo[0], 'balances'],
            addEmptyBalanceToAccount.bind(this, transfer.currency));
          memberTo = accountUtils.getAccountMember(accountMutable, transfer.to);
          memberToBalance = accountUtils.getMemberBalanceEntry(memberTo[1], transfer.currency);
        }

        let memberFromBalanceToAdd;
        let memberToBalanceToAdd;

        if (inverse === false) {
          memberFromBalanceToAdd = transfer.amount;
          memberToBalanceToAdd = -transfer.amount;
        } else {
          memberFromBalanceToAdd = -transfer.amount;
          memberToBalanceToAdd = transfer.amount;
        }

        accountMutable.updateIn(['members', memberFrom[0], 'balances', memberFromBalance[0], 'value'],
          updateValue.bind(this, memberFromBalanceToAdd));
        accountMutable.updateIn(['members', memberTo[0], 'balances', memberToBalance[0], 'value'],
          updateValue.bind(this, memberToBalanceToAdd));
      }
    });
  },
  getTransfersForSettlingMembers: function(members, currency) {
    const transfers = [];
    let membersByCurrency = [];

    for (let i = 0; i < members.size; i++) {
      const member = members.get(i);
      const balance = this.getMemberBalance(member, currency);

      if (balance) {
        membersByCurrency.push({
          member: member,
          value: balance.get('value'),
        });
      }
    }

    let resolvedMember = 0;

    function sortASC(a, b) {
      return a.value > b.value;
    }

    while (resolvedMember < membersByCurrency.length) {
      membersByCurrency = membersByCurrency.sort(sortASC);

      const from = membersByCurrency[0];
      const to = membersByCurrency[membersByCurrency.length - 1];

      const amount = (-from.value > to.value) ? to.value : -from.value;

      if (amount === 0) { // Every body is settled
        break;
      }

      from.value += amount;
      to.value -= amount;

      transfers.push({
        from: from.member,
        to: to.member,
        amount: amount,
        currency: currency,
      });

      resolvedMember++;
    }

    return transfers;
  },
  getCurrenciesWithMembers: function(members) {
    const currencies = [];

    for (let i = 0; i < members.size; i++) {
      const member = members.get(i);

      for (let j = 0; j < member.get('balances').size; j++) {
        const currency = member.getIn(['balances', j, 'currency']);
        if (currencies.indexOf(currency) === -1) {
          currencies.push(currency);
        }
      }
    }

    return currencies;
  },
  removeExpenseOfAccount: function(expense, account) {
    const transfers = expenseUtils.getTransfersDueToAnExpense(expense);

    account = this.applyTransfersToAccount(account, transfers, true); // Can lead to a balance with value = 0

    let dateLatestExpense = '';
    let currencyUsed = false;

    function removeFromList(index, list) {
      return list.remove(index);
    }

    for (let j = 0; j < account.get('expenses').size; j++) {
      const expenseCurrent = account.getIn(['expenses', j]);
      let id;

      if (typeof expenseCurrent === 'string') {
        id = expenseCurrent;
      } else {
        id = expenseCurrent.get('_id');
      }

      if (id && id === expense.get('_id') || expenseCurrent === expense) { // Remove the expense of the list of expenses
        account = account.update('expenses', removeFromList.bind(this, j));
        j--;
      } else {
        if (expenseCurrent.get('date') > dateLatestExpense) { // update the last date expense
          dateLatestExpense = expenseCurrent.get('date');
        }

        if (expenseCurrent.get('currency') === expense.get('currency')) {
          currencyUsed = true;
        }
      }
    }

    return account.withMutations(function(accountMutable) {
        // Let's remove the currency form balances of member
        if (!currencyUsed) {
          for (let i = 0; i < accountMutable.get('members').size; i++) {
            const memberBalance = accountUtils.getMemberBalanceEntry(
              accountMutable.getIn(['members', i]),
              expense.get('currency'));

            if (memberBalance) {
              accountMutable.updateIn(['members', i, 'balances'], removeFromList.bind(this, memberBalance[0]));
            }
          }
        }

        accountMutable.set('dateLatestExpense', dateLatestExpense !== '' ? dateLatestExpense : null);
      });
  },
  addExpenseToAccount: function(expense, account) {
    const transfers = expenseUtils.getTransfersDueToAnExpense(expense);

    account = this.applyTransfersToAccount(account, transfers);

    return account.withMutations(function(accountMutable) {
      accountMutable.updateIn(['expenses'], function(list) {
        return list.push(expense);
      });

      const date = expense.get('date');
      const dateLatestExpense = accountMutable.get('dateLatestExpense');

      if (typeof dateLatestExpense !== 'string' || date > dateLatestExpense) {
        accountMutable.set('dateLatestExpense', date);
      }
    });
  },

};

module.exports = accountUtils;
