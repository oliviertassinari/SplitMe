'use strict';

var Immutable = require('immutable');

var API = require('API');
var utils = require('utils');

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

    return Immutable.fromJS(account);
  },
  getExpense: function(options) {
    var expense = {
      description: options.description || 'description',
      amount: options.amount || 13.31,
      currency: options.currency || 'EUR',
      date: options.date || '2015-03-22',
      paidByContactId: options.paidByContactId || '0',
      split: 'equaly',
      paidFor: [
        {
          contactId: '0',
          split_equaly: true,
        },
      ],
    };

    options.paidForContactIds.forEach(function(contactId) {
      expense.paidFor.push({
        contactId: contactId,
        split_equaly: true,
      });
    });

    return Immutable.fromJS(expense);
  },
  getExpenseEqualy1: function() {
    return Immutable.fromJS({
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
    return Immutable.fromJS({
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
    return Immutable.fromJS({
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
    return Immutable.fromJS({
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
    return Immutable.fromJS([
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
    window.tests.API.destroyAll().then(done);
  },
  saveAccountAndExpenses: function(account, expenses) { // Used for the tests, close to save()
    var promise;
    var expensesAdded = [];

    function getPutExpensePromise(expense) {
      return API.putExpense(expense).then(function(expenseAdded) {
          expensesAdded.push(expenseAdded);
        });
    }

    expenses.forEach(function(expense) {
      if (promise) {
        promise = promise.then(function() {
            return getPutExpensePromise(expense);
          });
      } else {
        promise = getPutExpensePromise(expense);
      }
    });

    return promise.then(function() {
      expensesAdded.forEach(function(expense) {
        account = utils.addExpenseToAccount(expense, account);
      });

      return API.putAccount(account).then(function(accountAdded) {
        // accountAction.fetchAll();
        return accountAdded;
      });
    });
  },
  executeAsyncSaveAccountAndExpenses: function(account, expenses, done) { // browser context
    var immutable = window.tests.immutable;

    window.tests.fixture.saveAccountAndExpenses(immutable.fromJS(account), immutable.fromJS(expenses))
      .then(done);
  },
};

module.exports = fixture;
