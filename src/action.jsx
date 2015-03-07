'use strict';

var dispatcher = require('./dispatcher');

var actions = {
  navigateHome: function() {
    dispatcher.dispatch({
      actionType: 'NAVIGATE_HOME',
    });
  },

  navigateAddExpense: function() {
    dispatcher.dispatch({
      actionType: 'NAVIGATE_ADD_EXPENSE',
    });
  },

  showDialog: function(name) {
    dispatcher.dispatch({
      actionType: 'SHOW_DIALOG',
      name: name,
    });
  },

  dismissDialog: function() {
    dispatcher.dispatch({
      actionType: 'DISMISS_DIALOG',
    });
  },
};

module.exports = actions;
