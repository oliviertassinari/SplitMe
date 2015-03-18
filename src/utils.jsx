'use strict';

module.exports = {

  applyExpenseToAccounts: function(expense) {
    for (var i = 0; i < expense.paidFor.length; i++) {
      var paidFor = expense.paidFor[i];
      var accountToUpdate;

      // console.log('paidFor', paidFor);

      for (var j = 0; j < expense.accounts.length; j++) {
        var account = expense.accounts[j];
        var foundPaidBy = false;
        var foundPaidFor = false;

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

        // console.log(foundPaidFor, foundPaidBy);
      }

      // console.log('accountToUpdate', accountToUpdate);

      switch(expense.split) {
        case 'equaly':
          break;

        case 'unequaly':
          break;

        case 'shares':
          break;
      }
    }
  },
};
