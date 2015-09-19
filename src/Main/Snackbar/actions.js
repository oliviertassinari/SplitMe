'use strict';

const actions = {
  show: function(message, actionMessage, actionTouchTap) {
    return {
      type: 'SNACKBAR_SHOW',
      message: message,
      actionMessage: actionMessage,
      actionTouchTap: actionTouchTap,
    };
  },
  dismiss: function() {
    return {
      type: 'SNACKBAR_DISMISS',
    };
  },
};

module.exports = actions;
