'use strict';

var dispatcher = require('../dispatcher');

var actions = {
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
  tapAddExpense: function(account) {
    dispatcher.dispatch({
      actionType: 'TAP_ADD_EXPENSE',
      account: account,
    });
  },
  tapClose: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_TAP_CLOSE',
    });
  },
};

module.exports = actions;
