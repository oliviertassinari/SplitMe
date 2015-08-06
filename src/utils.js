'use strict';

var Immutable = require('immutable');
var _ = require('underscore');

var polyglot = require('polyglot');

var baseUrl = '';

// The assets are not a the url /
if (process.env.NODE_ENV === 'production') {
  baseUrl = window.location.pathname.replace('index.html', '');

  // Remove last /
  if (baseUrl.charAt(baseUrl.length - 1) === '/') {
    baseUrl = baseUrl.slice(0, -1);
  }
}

function getMemberBalance(member, currency) {
  return member.get('balances').findEntry(function(value) {
    return value.get('currency') === currency;
  });
}

var utils = {
  baseUrl: baseUrl,
  getNameMember: function(member) {
    if (member.get('id') === '0') {
      return polyglot.t('me');
    } else {
      return member.get('name');
    }
  },
  getNameAccount: function(account) {
    var name = account.get('name');

    if (name === '') {
      for (var i = 1; i < Math.min(account.get('members').size, 4); i++) {
        name += account.getIn(['members', i, 'name']) + ', ';
      }
      name = name.substring(0, name.length - 2);
    }

    return name;
  },
  isNumber: function(number) {
    return typeof number === 'number' && isFinite(number);
  },
  getTransfersDueToAnExpense: function(expense) {
    var paidForArray = expense.get('paidFor');
    var i;
    var sharesTotal = 0;

    // Remove contact that haven't paid
    switch(expense.get('split')) {
      case 'equaly':
        paidForArray = paidForArray.filter(function(paidFor) {
          return paidFor.get('split_equaly') === true;
        });
        break;

      case 'unequaly':
        paidForArray = paidForArray.filter(function(paidFor) {
          return utils.isNumber(paidFor.get('split_unequaly')) && paidFor.get('split_unequaly') > 0;
        });
        break;

      case 'shares':
        paidForArray = paidForArray.filter(function(paidFor) {
          return utils.isNumber(paidFor.get('split_shares')) && paidFor.get('split_shares') > 0;
        });

        for (i = 0; i < paidForArray.size; i++) {
          sharesTotal += paidForArray.getIn([i, 'split_shares']);
        }
        break;
    }

    var transfers = [];

    // Apply for each paidFor contact
    for (i = 0; i < paidForArray.size; i++) {
      var paidForCurrent = paidForArray.get(i);

      if(paidForCurrent.get('contactId') !== expense.get('paidByContactId')) {
        // get the amount transfered
        var amount = 0;

        switch(expense.get('split')) {
          case 'equaly':
            amount = expense.get('amount') / paidForArray.size;
            break;

          case 'unequaly':
            amount = paidForCurrent.get('split_unequaly');
            break;

          case 'shares':
            amount = expense.get('amount') * (paidForCurrent.get('split_shares') / sharesTotal);
            break;
        }

        if(amount !== 0) {
          transfers.push({
            from: expense.get('paidByContactId'),
            to: paidForCurrent.get('contactId'),
            amount: amount,
            currency: expense.get('currency'),
          });
        }
      }
    }

    return transfers;
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
      for (var i = 0; i < transfers.length; i++) {
        var transfer = transfers[i];

        var memberFrom = utils.getAccountMember(accountMutable, transfer.from);
        var memberTo = utils.getAccountMember(accountMutable, transfer.to);

        var memberFromBalance = getMemberBalance(memberFrom[1], transfer.currency);

        if (!memberFromBalance) {
          accountMutable.updateIn(['members', memberFrom[0], 'balances'], addEmptyBalanceToAccount.bind(this, transfer.currency));
          memberFrom = utils.getAccountMember(accountMutable, transfer.from);
          memberFromBalance = getMemberBalance(memberFrom[1], transfer.currency);
        }

        var memberToBalance = getMemberBalance(memberTo[1], transfer.currency);

        if (!memberToBalance) {
          accountMutable.updateIn(['members', memberTo[0], 'balances'], addEmptyBalanceToAccount.bind(this, transfer.currency));
          memberTo = utils.getAccountMember(accountMutable, transfer.to);
          memberToBalance = getMemberBalance(memberTo[1], transfer.currency);
        }

        var memberFromBalanceToAdd;
        var memberToBalanceToAdd;

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
  addExpenseToAccount: function(expense, account) {
    var transfers = utils.getTransfersDueToAnExpense(expense);

    account = this.applyTransfersToAccount(account, transfers);

    return account.withMutations(function(accountMutable) {
      accountMutable.updateIn(['expenses'], function(list) {
        return list.push(expense);
      });

      accountMutable.set('dateLastExpense', expense.get('date'));
    });
  },
  removeExpenseOfAccount: function(expense, account) {
    var transfers = utils.getTransfersDueToAnExpense(expense);

    account = this.applyTransfersToAccount(account, transfers, true); // Can lead to a balance with value = 0

    var dateLastExpense = '';
    var currencyUsed = false;

    function removeFromList(index, list) {
      return list.remove(index);
    }

    for (var j = 0; j < account.get('expenses').size; j++) {
      var expenseCurrent = account.getIn(['expenses', j]);
      var id;

      if(typeof expenseCurrent === 'string') {
        id = expenseCurrent;
      } else {
        id = expenseCurrent.get('_id');
      }

      if(id && id === expense.get('_id') || expenseCurrent === expense) { // Remove the expense of the list of expenses
        account = account.update('expenses', removeFromList.bind(this, j));
        j--;
      } else {
        if (expenseCurrent.get('date') > dateLastExpense) { // update the last date expense
          dateLastExpense = expenseCurrent.get('date');
        }

        if (expenseCurrent.get('currency') === expense.get('currency')) {
          currencyUsed = true;
        }
      }
    }

    return account.withMutations(function(accountMutable) {
        // Let's remove the currency
        if (!currencyUsed) {
          for (var i = 0; i < accountMutable.get('members').size; i++) {
            var memberBalance = getMemberBalance(accountMutable.getIn(['members', i]), expense.get('currency'));

            accountMutable.updateIn(['members', i, 'balances'], removeFromList.bind(this, memberBalance[0]));
          }
        }

        accountMutable.set('dateLastExpense', dateLastExpense !== '' ? dateLastExpense : null);
      });
  },
  getTransfersForSettlingMembers: function(members, currency) {
    members = members.toJS();
    var transfers = [];
    var membersByCurrency = [];

    for (var i = 0; i < members.length; i++) {
      var member = members[i];
      var balance = _.findWhere(member.balances, { currency: currency });

      if (balance) {
        membersByCurrency.push({
          member: member,
          value: balance.value,
        });
      }
    }

    var resolvedMember = 0;

    function sortASC(a, b) {
      return a.value > b.value;
    }

    while (resolvedMember < membersByCurrency.length) {
      membersByCurrency = membersByCurrency.sort(sortASC);

      var from = membersByCurrency[0];
      var to = membersByCurrency[membersByCurrency.length - 1];

      var amount = (-from.value > to.value) ? to.value : -from.value;

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
    var currencies = [];

    for (var i = 0; i < members.size; i++) {
      var member = members.get(i);

      for (var j = 0; j < member.get('balances').size; j++) {
        var currency = member.getIn(['balances', j, 'currency']);
        if (currencies.indexOf(currency) === -1) {
          currencies.push(currency);
        }
      }
    }

    return currencies;
  },
};

module.exports = utils;
