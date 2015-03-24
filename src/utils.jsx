'use strict';

module.exports = {

  currencyMap: {
    'EUR': '€',
    'USD': '$',
  },
  roundAmount: function(amount) {
    return Math.round(100 * amount) / 100;
  },
  getExpenseMembers: function(expense) {
    var me = {
      id: '0',
      displayName: 'Me',
    };

    // I should always be in expense members
    var array = [me];
    var hash = {
      '0': me,
    };

    for (var i = 0; i < expense.accounts.length; i++) {
      var account = expense.accounts[i];

      for (var j = 0; j < account.members.length; j++) {
        var contact = account.members[j];

        if(!hash[contact.id]) {
          array.push(contact);
          hash[contact.id] = contact;
        }
      }
    }

    return {
      array: array,
      hash: hash,
    };
  },
  applyExpenseToAccounts: function(expense) {
    var paidForArray = expense.paidFor;
    var i;
    var sharesTotal = 0;
    var account;

    switch(expense.split) {
      case 'equaly':
        // Remove contact that haven't paid
        paidForArray = paidForArray.filter(function(paidFor) {
          return paidFor.split_equaly;
        });
        break;

      case 'shares':
        for (i = 0; i < paidForArray.length; i++) {
          sharesTotal += paidForArray[i].split_shares;
        }
        break;
    }

    // Apply for each paidFor contact
    for (i = 0; i < paidForArray.length; i++) {
      var paidFor = paidForArray[i];

      if(paidFor.contactId !== expense.paidByContactId) {
        // get balance difference to add
        var balanceDiff = 0;

        switch(expense.split) {
          case 'equaly':
            balanceDiff = expense.amount / paidForArray.length;
            break;

          case 'unequaly':
            balanceDiff = paidFor.split_unequaly;
            break;

          case 'shares':
            balanceDiff = expense.amount * (paidFor.split_shares / sharesTotal);
            break;
        }

        if(balanceDiff !== 0) {
          // Set the direction of the expense regarding the owner
          if(expense.paidByContactId !== '0') {
            balanceDiff *= -1;
          }

          // Search account to update
          var accountToUpdate;

          for (var j = 0; j < expense.accounts.length; j++) {
            account = expense.accounts[j];
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

          accountToUpdate.balances[0].value += balanceDiff;
        }
      }
    }

    for (i = 0; i < expense.accounts.length; i++) {
      account = expense.accounts[i];

      account.expenses.push(expense);
      account.dateLastExpense = expense.date;
    }
  },
};
