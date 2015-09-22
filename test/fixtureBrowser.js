'use strict';

const API = require('API');
const accountUtils = require('Main/Account/utils');
const store = require('redux/store');
const accountActions = require('Main/Account/actions');

const fixtureBrowser = {
  saveAccountAndExpenses: function(account, expenses) {
    const expensesAdded = [];
    let promise;

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
        account = accountUtils.addExpenseToAccount(expense, account);
      });

      return API.putAccount(account).then(function(accountAdded) {
        store.dispatch(accountActions.fetchAll());
        return accountAdded;
      });
    });
  },
};

module.exports = fixtureBrowser;
