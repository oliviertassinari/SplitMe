'use strict';

var dispatcher = require('../dispatcher');

var actions = {
  fetchAll: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_FETCH_ALL'
    });
  },
  tapList: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_TAP_LIST'
    });
  },
  tapAddExpense: function() {
    dispatcher.dispatch({
      actionType: 'TAP_ADD_EXPENSE'
    });
  },
};

module.exports = actions;
