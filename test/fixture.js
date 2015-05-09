'use strict';

module.exports = {
  getAccount: function(name, memberId) {
    return {
      name: name,
      dateLastExpense: null,
      expenses: [],
      members: [{ // Me always on 1st position
        id: '0', // Me
        balances: [],
      }, {
        id: memberId,
        displayName: name,
        balances: [],
      }],
    };
  },
  getExpense: function(contactId) {
    return {
      description: 'description',
      amount: 13.31,
      currency: 'EUR',
      category: 'individual',
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
  getExpenseEqualy1: function() {
    return {
      amount: 13.31,
      currency: 'EUR',
      date: '2015-03-21',
      paidByContactId: '0',
      split: 'equaly',
      paidFor: [
        {
          contactId: '0',
          split_equaly: true,
        },
        {
          contactId: '10',
          split_equaly: true,
        },
        {
          contactId: '11',
          split_equaly: true,
        },
      ],
      accounts: [
        this.getAccount('A', '10'),
        this.getAccount('B', '11')
      ],
    };
  },
  getExpenseEqualy2: function() {
    return {
      amount: 13.31,
      currency: 'EUR',
      paidByContactId: '0',
      date: '2015-03-21',
      split: 'equaly',
      paidFor: [
        {
          contactId: '0',
          split_equaly: true,
        },
        {
          contactId: '10',
          split_equaly: true,
        },
        {
          contactId: '11',
          split_equaly: false,
        },
      ],
      accounts: [
        this.getAccount('A', '10'),
        this.getAccount('B', '11')
      ],
    };
  },
  getExpenseUnequaly: function() {
    return {
      amount: 13.31,
      currency: 'EUR',
      paidByContactId: '0',
      date: '2015-03-21',
      split: 'unequaly',
      paidFor: [
        {
          contactId: '0',
          split_unequaly: 1,
        },
        {
          contactId: '10',
          split_unequaly: 12.31,
        },
      ],
      accounts: [
        this.getAccount('A', '10')
      ],
    };
  },
  getExpenseShares: function() {
    return {
      amount: 13.31,
      currency: 'EUR',
      paidByContactId: '0',
      date: '2015-03-21',
      split: 'shares',
      paidFor: [
        {
          contactId: '0',
          split_shares: 2,
        },
        {
          contactId: '10',
          split_shares: 3,
        },
      ],
      accounts: [
        this.getAccount('A', '10'),
        this.getAccount('B', '11')
      ],
    };
  },
};
