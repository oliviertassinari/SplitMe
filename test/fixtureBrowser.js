'use strict';

var API = require('API');
var utils = require('utils');
var store = require('redux/store');
var accountActions = require('Main/Account/actions');

var fixtureBrowser = {
  saveAccountAndExpenses: function(account, expenses) {
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
        store.dispatch(accountActions.fetchAll());
        return accountAdded;
      });
    });
  },
};

module.exports = fixtureBrowser;
