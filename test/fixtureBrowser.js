'use strict';

const API = require('API');
const accountUtils = require('Main/Account/utils');

const fixtureBrowser = {
  saveAccountAndExpenses(account, expenses) {
    const expensesAdded = [];
    let promise;

    function getPutExpensePromise(expense) {
      return API.putExpense(expense).then((expenseAdded) => {
        expensesAdded.push(expenseAdded);
      });
    }

    expenses.forEach((expense) => {
      if (promise) {
        promise = promise.then(() => {
          return getPutExpensePromise(expense);
        });
      } else {
        promise = getPutExpensePromise(expense);
      }
    });

    return promise.then(() => {
      expensesAdded.forEach((expense) => {
        account = accountUtils.addExpenseToAccount(expense, account);
      });

      return API.putAccount(account).then((accountAdded) => {
        if (typeof window !== 'undefined') {
          const store = require('redux/store');
          const accountActions = require('Main/Account/actions');
          store.dispatch(accountActions.showList());
        }
        return accountAdded;
      });
    });
  },
};

module.exports = fixtureBrowser;
