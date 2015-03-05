'use strict';

var dispatcher = require('../dispatcher');

var actions = {
  tapClose: function() {
    dispatcher.dispatch({
      actionType: 'EXPENSE_TAP_CLOSE',
    });
  },

  tapSave: function() {
    dispatcher.dispatch({
      actionType: 'EXPENSE_TAP_SAVE',
    });
  },

  changePaidBy: function(paidBy) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_CHANGE_PAID_BY',
      paidBy: paidBy,
    });
  },

  changeSplit: function(split) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_CHANGE_SPLIT',
      split: split,
    });
  },

  changePaidFor: function(paidFor) {
    dispatcher.dispatch({
      actionType: 'EXPENSE_CHANGE_PAID_FOR',
      paidFor: paidFor,
    });
  },
};

module.exports = actions;
