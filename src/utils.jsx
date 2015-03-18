'use strict';

module.exports = {

  roundAmount: function(amount) {
    return Math.round(100 * amount) / 100;
  },

  applyExpenseToAccounts: function(expense) {
    var paidForArray = expense.paidFor;

    if(expense.split === 'equaly') {
      paidForArray = paidForArray.filter(function(paidFor) {
        return paidFor.split_equaly;
      });
    }

    // Apply for each paidFor contact
    for (var i = 0; i < paidForArray.length; i++) {
      var paidFor = paidForArray[i];

      if(paidFor.contactId !== expense.paidByContactId) {
        // get balance difference to add
        var balanceDiff = 0;

        switch(expense.split) {
          case 'equaly':
            balanceDiff = expense.amount / paidForArray.length;
            break;

          case 'unequaly':
            break;

          case 'shares':
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

          accountToUpdate.balances[0].value += balanceDiff;
        }

        // console.log('accountToUpdate', accountToUpdate.name, balanceDiff);
      }
    }
  },
};
