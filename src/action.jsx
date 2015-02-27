'use strict';

var dispatcher = require('./dispatcher');

var actions = {
  navigateHome: function() {
    dispatcher.dispatch({
      actionType: 'NAVIGATE_HOME'
    });
  },

  navigateAddExpense: function() {
    dispatcher.dispatch({
      actionType: 'NAVIGATE_ADD_EXPENSE'
    });
  }
};

module.exports = actions;
