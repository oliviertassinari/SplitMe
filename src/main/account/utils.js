import Immutable from 'immutable';
import polyglot from 'polyglot';
import expenseUtils from 'main/expense/utils';
import API from 'API';

const accountUtils = {
  findEntry(accounts, accountId) {
    accountId = API.accountAddPrefixId(accountId);

    return accounts.findEntry(account => {
      return account.get('_id') === accountId;
    });
  },
  isValideMember(account, member) {
    if (accountUtils.getMemberEntry(account, member.get('id'))) {
      return {
        status: false,
        message: polyglot.t('contact_add_error_already'),
      };
    }

    if (member.get('name') == null) {
      return {
        status: false,
        message: polyglot.t('contact_add_error_no_name'),
      };
    }

    return {
      status: true,
    };
  },
  getMemberEntry(account, memberId) {
    return account.get('members').findEntry(value => {
      return value.get('id') === memberId;
    });
  },
  getMemberBalanceEntry(member, currency) {
    return member.get('balances').findEntry(value => {
      return value.get('currency') === currency;
    });
  },
  getMemberBalance(member, currency) {
    return member.get('balances').find(item => {
      return item.get('currency') === currency;
    });
  },
  getNameMember(member) {
    if (member.get('id') === '0') {
      return polyglot.t('me');
    }

    // add displayName for backward compatibility
    return member.get('name') || member.get('displayName');
  },
  getNameAccount(account) {
    if (!account) {
      return '';
    }

    let name = account.get('name');

    const NAME_NUMBER_MAX = 4;

    if (name === '') {
      for (let i = 1; i < Math.min(account.get('members').size, NAME_NUMBER_MAX); i += 1) {
        name += `${account.getIn(['members', i, 'name'])}, `;
      }
      name = name.substring(0, name.length - 2);
    }

    return name;
  },
  applyTransfersToAccount(account, transfers, inverse) {
    if (!inverse) {
      inverse = false; // Boolean
    }

    function addEmptyBalanceToAccount(currency, list) {
      return list.push(
        Immutable.fromJS({
          currency,
          value: 0,
        }),
      );
    }

    function updateValue(toAdd, number) {
      return number + toAdd;
    }

    return account.withMutations(accountMutable => {
      for (let i = 0; i < transfers.length; i += 1) {
        const transfer = transfers[i];

        let memberFrom = accountUtils.getMemberEntry(accountMutable, transfer.from);
        let memberTo = accountUtils.getMemberEntry(accountMutable, transfer.to);

        let memberFromBalance = accountUtils.getMemberBalanceEntry(
          memberFrom[1],
          transfer.currency,
        );

        if (!memberFromBalance) {
          accountMutable.updateIn(
            ['members', memberFrom[0], 'balances'],
            addEmptyBalanceToAccount.bind(this, transfer.currency),
          );
          memberFrom = accountUtils.getMemberEntry(accountMutable, transfer.from);
          memberFromBalance = accountUtils.getMemberBalanceEntry(memberFrom[1], transfer.currency);
        }

        let memberToBalance = accountUtils.getMemberBalanceEntry(memberTo[1], transfer.currency);

        if (!memberToBalance) {
          accountMutable.updateIn(
            ['members', memberTo[0], 'balances'],
            addEmptyBalanceToAccount.bind(this, transfer.currency),
          );
          memberTo = accountUtils.getMemberEntry(accountMutable, transfer.to);
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

        accountMutable.updateIn(
          ['members', memberFrom[0], 'balances', memberFromBalance[0], 'value'],
          updateValue.bind(this, memberFromBalanceToAdd),
        );
        accountMutable.updateIn(
          ['members', memberTo[0], 'balances', memberToBalance[0], 'value'],
          updateValue.bind(this, memberToBalanceToAdd),
        );
      }
    });
  },
  getTransfersForSettlingMembers(members, currency) {
    const transfers = [];
    let membersByCurrency = [];

    for (let i = 0; i < members.size; i += 1) {
      const member = members.get(i);
      const balance = this.getMemberBalance(member, currency);

      if (balance) {
        membersByCurrency.push({
          member,
          value: balance.get('value'),
        });
      }
    }

    let resolvedMember = 0;

    function sortASC(a, b) {
      if (a.value < b.value) {
        return -1;
      }

      if (a.value === b.value) {
        return 0;
      }

      return 1;
    }

    while (resolvedMember < membersByCurrency.length) {
      membersByCurrency = membersByCurrency.sort(sortASC);

      const from = membersByCurrency[0];
      const to = membersByCurrency[membersByCurrency.length - 1];

      const amount = -from.value > to.value ? to.value : -from.value;

      if (amount === 0) {
        // Every body is settled
        break;
      }

      from.value += amount;
      to.value -= amount;

      transfers.push({
        from: from.member,
        to: to.member,
        amount,
        currency,
      });

      resolvedMember += 1;
    }

    return transfers;
  },
  getCurrenciesWithMembers(members) {
    const currencies = [];

    members.forEach(member => {
      member.get('balances').forEach(balance => {
        const currency = balance.get('currency');

        if (currencies.indexOf(currency) === -1) {
          currencies.push(currency);
        }
      });
    });

    return currencies;
  },
  removeExpenseOfAccount(expense, account) {
    const transfers = expenseUtils.getTransfersDueToAnExpense(expense);

    // Can lead to a balance with value = 0
    account = this.applyTransfersToAccount(account, transfers, true);

    let dateLatestExpense = '';
    let currencyUsed = false;

    function removeFromList(index, list) {
      return list.remove(index);
    }

    for (let j = 0; j < account.get('expenses').size; j += 1) {
      const expenseCurrent = account.getIn(['expenses', j]);
      let id;

      if (typeof expenseCurrent === 'string') {
        id = expenseCurrent;
      } else {
        id = expenseCurrent.get('_id');
      }

      // Remove the expense of the list of expenses
      if ((id && id === expense.get('_id')) || expenseCurrent === expense) {
        account = account.update('expenses', removeFromList.bind(this, j));
        j -= 1;
      } else {
        if (expenseCurrent.get('date') > dateLatestExpense) {
          // update the last date expense
          dateLatestExpense = expenseCurrent.get('date');
        }

        if (expenseCurrent.get('currency') === expense.get('currency')) {
          currencyUsed = true;
        }
      }
    }

    return account.withMutations(accountMutable => {
      // Let's remove the currency form balances of member
      if (!currencyUsed) {
        for (let i = 0; i < accountMutable.get('members').size; i += 1) {
          const memberBalance = accountUtils.getMemberBalanceEntry(
            accountMutable.getIn(['members', i]),
            expense.get('currency'),
          );

          if (memberBalance) {
            accountMutable.updateIn(
              ['members', i, 'balances'],
              removeFromList.bind(this, memberBalance[0]),
            );
          }
        }
      }

      accountMutable.set('dateLatestExpense', dateLatestExpense !== '' ? dateLatestExpense : null);
    });
  },
  addExpenseToAccount(expense, account) {
    const transfers = expenseUtils.getTransfersDueToAnExpense(expense);

    account = this.applyTransfersToAccount(account, transfers);

    return account.withMutations(accountMutable => {
      accountMutable.updateIn(['expenses'], list => {
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

export default accountUtils;
