'use strict';

const actions = {
  show(message, actionMessage, actionTouchTap) {
    return {
      type: 'SNACKBAR_SHOW',
      message: message,
      actionMessage: actionMessage,
      actionTouchTap: actionTouchTap,
    };
  },
  dismiss() {
    return {
      type: 'SNACKBAR_DISMISS',
    };
  },
};

module.exports = actions;
