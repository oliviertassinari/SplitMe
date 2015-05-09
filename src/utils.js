'use strict';

var _ = require('underscore');
var polyglot = require('./polyglot');

var baseUrl = '';

// The assets are not a the url /
if ('production' === process.env.NODE_ENV) {
  baseUrl = window.location.pathname.replace('index.html', '');

  // Remove last /
  if (baseUrl.charAt(baseUrl.length - 1) === '/') {
    baseUrl = baseUrl.slice(0, -1);
  }
}

var utils = {
  baseUrl: baseUrl,
  getDisplayName: function(contact) {
    if (contact.id === '0') {
      return polyglot.t('me');
    } else {
      return contact.displayName;
    }
  },
  getExpenseMembers: function(expense) {
    // I should always be in expense members
    var array = [];
    var hash = {};

    for (var i = 0; i < expense.accounts.length; i++) {
      var account = expense.accounts[i];

      for (var j = 0; j < account.members.length; j++) { // Me should always be at the first position
        var contact = account.members[j];

        if(!hash[contact.id]) {
          array.push(contact);
          hash[contact.id] = contact;
        }
      }
    }

    if(array.length === 0) {
      var me = {
        id: '0',
      };

      array = [me];
      hash = {
        0: me,
      };
    }

    return {
      array: array,
      hash: hash,
    };
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
      var paidFor = paidForArray[i];

      if(paidFor.contactId !== expense.paidByContactId) {
        // get the amount transfered
        var amount = 0;

        switch(expense.split) {
          case 'equaly':
            amount = expense.amount / paidForArray.length;
            break;

          case 'unequaly':
            amount = paidFor.split_unequaly;
            break;

          case 'shares':
            amount = expense.amount * (paidFor.split_shares / sharesTotal);
            break;
        }

        if(amount !== 0) {
          // Search account to update
          var accountToUpdate;

          for (var j = 0; j < expense.accounts.length; j++) {
            var account = expense.accounts[j];
            var foundPaidBy = false;
            var foundPaidFor = false;

            // Search contact in members
            for (var k = 0; k < account.members.length; k++) {
              var member = account.members[k];

              if(member.id === expense.paidByContactId) {
                foundPaidBy = true;
              } else if(member.id === paidFor.contactId) {
                foundPaidFor = true;
              }
            }

            if(foundPaidFor && foundPaidBy) {
              accountToUpdate = account;
              break;
            }
          }

          if (!accountToUpdate) {
            console.warn('accountToUpdate not found');
          }

          transfers.push({
            account: accountToUpdate,
            from: expense.paidByContactId,
            to: paidFor.contactId,
            amount: amount,
            currency: expense.currency,
          });
        }
      }
    }

    return transfers;
  },
  applyTransfersToAccounts: function(transfers, inverse) {
    if (!inverse) {
      inverse = false; // Boolean
    }

    function getAccountMember(account, id) {
      return _.findWhere(account.members, { id: id });
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
      var account = transfer.account;

      var memberFrom = getAccountMember(account, transfer.from);
      var memberTo = getAccountMember(account, transfer.to);

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
  addExpenseToAccounts: function(expense) {
    var transfers = utils.getTransfersDueToAnExpense(expense);
    this.applyTransfersToAccounts(transfers);

    for (var i = 0; i < transfers.length; i++) {
      var transfer = transfers[i];
      var account = transfer.account;

      account.expenses.push(expense);
      account.dateLastExpense = expense.date;
    }
  },
  removeExpenseOfAccounts: function(expense) {
    var transfers = utils.getTransfersDueToAnExpense(expense);
    this.applyTransfersToAccounts(transfers, true); // Can lead to a balance with value = 0

    for (var i = 0; i < transfers.length; i++) {
      var transfer = transfers[i];
      var account = transfer.account;

      var dateLastExpense = null;

      for (var j = 0; j < account.expenses.length; j++) {
        var expenseCurrent = account.expenses[j];

        var id;

        if(typeof expenseCurrent === 'string') {
          id = expenseCurrent;
        } else {
          id = expenseCurrent._id;
        }

        if(id === expense._id) {
          account.expenses.splice(j, 1);
          j--;
        } else if (expense.date > dateLastExpense) {
          dateLastExpense = expense.date;
        }
      }

      account.dateLastExpense = dateLastExpense;
    }
  },
  getTransfersForSettlingMembers: function(members) {
    var transfers = [];

    var resolvedMember = 0;

    while (resolvedMember < members.length) {
      members = members.sort(function(a, b) { // ASC
        return a.value > b.value;
      });

      var from = members[0];
      var to = members[members.length - 1];

      var amount = (-from.value > to.value) ? to.value : -from.value;

      if (amount === 0) { // Every body is settled
        break;
      }

      from.value += amount;
      to.value -= amount;

      transfers.push({
        from: from.contactId,
        to: to.contactId,
        amount: amount,
      });

      resolvedMember++;
    }

    return transfers;
  },
};

module.exports = utils;
