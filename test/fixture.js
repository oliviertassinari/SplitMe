'use strict';

module.exports = {
  getAccount: function(name, memberId) {
    return {
      name: name,
      dateLastExpense: null,
      expenses: [],
      members: [{ // Me always on 1st position
        id: '0',
        displayName: 'Me',
      },{
        id: memberId,
        displayName: name,
      }],
      balances: [{
        value: 0,
        currency: 'EUR',
      }],
    };
  },
  getExpense: function(contactId) {
    return {
      amount: 13.31,
      currency: 'EUR',
      type: 'individual',
      date: '2015-03-21',
      paidByContactId: '0',
      split: 'equaly',
      paidFor: [
        {
          contactId: '0',
          split_equaly: true,
        },
        {
          contactId: contactId,
          split_equaly: true,
        },
      ],
    };
  },
};
