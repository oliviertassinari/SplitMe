'use strict';

var dispatcher = require('../dispatcher');

var actions = {
  fetchAll: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_FETCH_ALL'
    });
  },
  tapItem: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_TAP_ITEM'
    });
  },
  tapAddExpense: function() {
    dispatcher.dispatch({
      actionType: 'TAP_ADD_EXPENSE'
    });
  },
};

module.exports = actions;
