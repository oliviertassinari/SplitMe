'use strict';

var dispatcher = require('../dispatcher');

var action = {
  fetchAll: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_FETCH_ALL',
    });
  },
  tapList: function(account) {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_TAP_LIST',
      account: account,
    });
  },
  tapAddExpense: function() {
    dispatcher.dispatch({
      actionType: 'TAP_ADD_EXPENSE',
    });
  },
  tapAddExpenseForAccount: function(account) {
    dispatcher.dispatch({
      actionType: 'TAP_ADD_EXPENSE_FOR_ACCOUNT',
      account: account,
    });
  },
  tapClose: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_TAP_CLOSE',
    });
  },
};

module.exports = action;
