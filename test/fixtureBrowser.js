'use strict';

import API from 'API';
import accountUtils from 'main/account/utils';

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
          const accountActions = require('main/account/actions').default;
          window.tests.store.dispatch(accountActions.fetchList(true));
        }
        return accountAdded;
      });
    });
  },
};

export default fixtureBrowser;
