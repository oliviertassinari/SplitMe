'use strict';

const actionTypes = require('redux/actionTypes');

const actions = {
  show(message, actionMessage, actionTouchTap) {
    return {
      type: actionTypes.SNACKBAR_SHOW,
      message: message,
      actionMessage: actionMessage,
      actionTouchTap: actionTouchTap,
    };
  },
  dismiss() {
    return {
      type: actionTypes.SNACKBAR_DISMISS,
    };
  },
};

module.exports = actions;
