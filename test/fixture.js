'use strict';

var fixture = {
  getAccount: function(members) {
    var account = {
      name: members[0].name,
      dateLastExpense: null,
      expenses: [],
      members: [{ // Me always on 1st position
        id: '0', // Me
        balances: [],
      }],
    };

    for (var i = 0; i < members.length; i++) {
      var member = members[i];

      account.members.push({
        id: member.id,
        displayName: member.name,
        balances: [],
      });
    }

    return account;
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
      account: this.getAccount([
        {
          name: 'A',
          id: '10',
        },
        {
          name: 'B',
          id: '11'
        },
      ]),
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
      account: this.getAccount([
        {
          name: 'A',
          id: '10',
        },
        {
          name: 'B',
          id: '11'
        },
      ]),
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
      account: this.getAccount([
        {
          name: 'A',
          id: '10',
        },
      ]),
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
      account: this.getAccount([
        {
          name: 'A',
          id: '10',
        },
        {
          name: 'B',
          id: '11'
        },
      ]),
    };
  },
  getMembersWhereBalanceComplexe: function() {
    return [
      {
        id: '0',
        balances: [{
          currency: 'EUR',
          value: -10
        }]
      },
      {
        id: '1',
        balances: [{
          currency: 'EUR',
          value: 30
        }]
      },
      {
        id: '2',
        balances: [{
          currency: 'EUR',
          value: -50
        }]
      },
      {
        id: '3',
        balances: [{
          currency: 'EUR',
          value: 30
        }]
      },
      {
        id: '4',
        balances: [{
          currency: 'USD',
          value: 30
        }]
      }
    ];
  },
  executeAsyncSaveExpenses: function(expenses, done) { // browser context
    var API = window.tests.API;
    var expenseStore = window.tests.expenseStore;
    var Lie = window.tests.Lie;

    API.destroyAll().then(function() {
      var promises = [];

      for (var i = 0; i < expenses.length; i++) {
        var expense = expenses[i];

        promises.push(expenseStore.save(null, expense));
      }

      Lie.all(promises).then(function() {
        done();
      });
    });
  },
};

module.exports = fixture;
