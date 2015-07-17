'use strict';

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

var utils = {
  baseUrl: baseUrl,
  getDisplayNameMember: function(member) {
    if (member.id === '0') {
      return polyglot.t('me');
    } else {
      return member.displayName;
    }
  },
  getNameAccount: function(account) {
    var name = account.name;

    if (name === '') {
      for (var i = 1; i < Math.min(account.members.length, 4); i++) {
        name += account.members[i].displayName + ', ';
      }
      name = name.substring(0, name.length - 2);
    }

    return name;
  },
  isNumber: function(number) {
    return typeof number === 'number' && isFinite(number);
  },
  getTransfersDueToAnExpense: function(expense) {
    var paidForArray = expense.paidFor;
    var i;
    var sharesTotal = 0;

    // Remove contact that haven't paid
    switch(expense.split) {
      case 'equaly':
        paidForArray = paidForArray.filter(function(paidFor) {
          return paidFor.split_equaly === true;
        });
        break;

      case 'unequaly':
        paidForArray = paidForArray.filter(function(paidFor) {
          return utils.isNumber(paidFor.split_unequaly) && paidFor.split_unequaly > 0;
        });
        break;

      case 'shares':
        paidForArray = paidForArray.filter(function(paidFor) {
          return utils.isNumber(paidFor.split_shares) && paidFor.split_shares > 0;
        });

        for (i = 0; i < paidForArray.length; i++) {
          sharesTotal += paidForArray[i].split_shares;
        }
        break;
    }

    var transfers = [];

    // Apply for each paidFor contact
    for (i = 0; i < paidForArray.length; i++) {
      var paidForCurrent = paidForArray[i];

      if(paidForCurrent.contactId !== expense.paidByContactId) {
        // get the amount transfered
        var amount = 0;

        switch(expense.split) {
          case 'equaly':
            amount = expense.amount / paidForArray.length;
            break;

          case 'unequaly':
            amount = paidForCurrent.split_unequaly;
            break;

          case 'shares':
            amount = expense.amount * (paidForCurrent.split_shares / sharesTotal);
            break;
        }

        if(amount !== 0) {
          transfers.push({
            from: expense.paidByContactId,
            to: paidForCurrent.contactId,
            amount: amount,
            currency: expense.currency,
          });
        }
      }
    }

    return transfers;
  },
  getAccountMember: function(account, memberId) {
    return _.findWhere(account.members, { id: memberId });
  },
  applyTransfersToAccount: function(account, transfers, inverse) {
    if (!inverse) {
      inverse = false; // Boolean
    }

    function getMemberBalance(member, currency) {
      var memberBalance = _.findWhere(member.balances, { currency: currency });

      if (!memberBalance) {
        memberBalance = {
          currency: currency,
          value: 0,
        };
        member.balances.push(memberBalance);
      }

      return memberBalance;
    }

    for (var i = 0; i < transfers.length; i++) {
      var transfer = transfers[i];

      var memberFrom = utils.getAccountMember(account, transfer.from);
      var memberTo = utils.getAccountMember(account, transfer.to);

      var memberFromBalance = getMemberBalance(memberFrom, transfer.currency);
      var memberToBalance = getMemberBalance(memberTo, transfer.currency);

      if (inverse === false) {
        memberFromBalance.value += transfer.amount;
        memberToBalance.value -= transfer.amount;
      } else {
        memberFromBalance.value -= transfer.amount;
        memberToBalance.value += transfer.amount;
      }
    }
  },
  addExpenseToAccount: function(expense, account) {
    var transfers = utils.getTransfersDueToAnExpense(expense);

    this.applyTransfersToAccount(account, transfers);

    account.expenses.push(expense);
    account.dateLastExpense = expense.date;
  },
  removeExpenseOfAccount: function(expense, account) {
    var transfers = utils.getTransfersDueToAnExpense(expense);

    this.applyTransfersToAccount(account, transfers, true); // Can lead to a balance with value = 0

    var dateLastExpense = '';
    var currencyUsed = false;

    for (var j = 0; j < account.expenses.length; j++) {
      var expenseCurrent = account.expenses[j];
      var id;

      if(typeof expenseCurrent === 'string') {
        id = expenseCurrent;
      } else {
        id = expenseCurrent._id;
      }

      if(id && id === expense._id || expenseCurrent === expense) { // Remove the expense of the list of expenses
        account.expenses.splice(j, 1);
        j--;
      } else {
        if (expenseCurrent.date > dateLastExpense) { // update the last date expense
          dateLastExpense = expenseCurrent.date;
        }

        if (expenseCurrent.currency === expense.currency) {
          currencyUsed = true;
        }
      }
    }

    // Let's remove the currency
    if (!currencyUsed) {
      for (var i = 0; i < account.members.length; i++) {
        var member = account.members[i];
        var memberBalance = _.findWhere(member.balances, { currency: expense.currency });

        member.balances.splice(member.balances.indexOf(memberBalance), 1);
      }
    }

    account.dateLastExpense = dateLastExpense !== '' ? dateLastExpense : null;
  },
  getTransfersForSettlingMembers: function(members, currency) {
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
  getCurrenciesWithMembers: function (members) {
    var currencies = [];

    for (var i = 0; i < members.length; i++) {
      var member = members[i];

      for (var j = 0; j < member.balances.length; j++) {
        var currency = member.balances[j].currency;
        if (currencies.indexOf(currency) === -1) {
          currencies.push(currency);
        }
      }
    }

    return currencies;
  }
};

module.exports = utils;
