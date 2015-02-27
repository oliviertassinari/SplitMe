'use strict';

var dispatcher = require('../dispatcher');

var actions = {
  tapClose: function() {
    dispatcher.dispatch({
      actionType: 'EXPENSE_TAP_CLOSE'
    });
  },

  tapSave: function() {
    dispatcher.dispatch({
      actionType: 'EXPENSE_TAP_SAVE'
    });
  },
};

module.exports = actions;
