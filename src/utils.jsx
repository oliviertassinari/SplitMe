'use strict';

module.exports = {

  roundAmount: function(amount) {
    return Math.round(100 * amount) / 100;
  },

  applyExpenseToAccounts: function(expense) {
    // Apply for each paidFor contact
    for (var i = 0; i < expense.paidFor.length; i++) {
      var paidFor = expense.paidFor[i];

      if(paidFor.contactId !== expense.paidByContactId) {
        var accountToUpdate;

        // Search account to update
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

        var balanceDiff;

        switch(expense.split) {
          case 'equaly':
            balanceDiff = expense.amount / expense.paidFor.length;
            break;

          case 'unequaly':
            break;

          case 'shares':
            break;
        }

        if(expense.paidByContactId !== '0') {
          balanceDiff *= -1;
        }

        accountToUpdate.balances[0].value = balanceDiff;

        // console.log('accountToUpdate', accountToUpdate.name, balanceDiff);
      }
    }
  },
};
