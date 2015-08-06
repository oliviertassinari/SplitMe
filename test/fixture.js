'use strict';

var immutable = require('immutable');

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
        name: member.name,
        balances: [],
      });
    }

    return immutable.fromJS(account);
  },
  getExpense: function(options) {
    var expense = {
      description: 'description',
      amount: 13.31,
      currency: options.currency ? options.currency : 'EUR',
      date: '2015-03-22',
      paidByContactId: options.paidByContactId ? options.paidByContactId : '0',
      split: 'equaly',
      paidFor: [
        {
          contactId: '0',
          split_equaly: true,
        },
      ],
    };

    options.contactIds.forEach(function(contactId) {
      expense.paidFor.push({
        contactId: contactId,
        split_equaly: true,
      });
    });

    return immutable.fromJS(expense);
  },
  getExpenseEqualy1: function() {
    return immutable.fromJS({
      description: 'description',
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
    });
  },
  getExpenseEqualy2: function() {
    return immutable.fromJS({
      description: 'description',
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
    });
  },
  getExpenseUnequaly: function() {
    return immutable.fromJS({
      description: 'description',
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
    });
  },
  getExpenseShares: function() {
    return immutable.fromJS({
      description: 'description',
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
    });
  },
  getMembersWhereBalanceComplexe: function() {
    return immutable.fromJS([
      {
        id: '0',
        balances: [{
          currency: 'EUR',
          value: -10,
        }],
      },
      {
        id: '1',
        balances: [{
          currency: 'EUR',
          value: 30,
        }],
      },
      {
        id: '2',
        balances: [{
          currency: 'EUR',
          value: -50,
        }],
      },
      {
        id: '3',
        balances: [{
          currency: 'EUR',
          value: 30,
        }],
      },
      {
        id: '4',
        balances: [{
          currency: 'USD',
          value: 30,
        }],
      },
    ]);
  },
  executeAsyncDestroyAll: function(done) { // browser context
    var API = window.tests.API;
    API.destroyAll().then(done);
  },
  executeAsyncSaveAccountAndExpenses: function(account, expenses, done) { // browser context
    var expenseStore = window.tests.expenseStore;

    expenseStore.saveAccountAndExpenses(account, expenses).then(done);
  },
};

module.exports = fixture;
