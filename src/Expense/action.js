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
  }
};

module.exports = actions;
