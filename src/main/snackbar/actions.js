// @flow weak

import actionTypes from 'redux/actionTypes';

const actions = {
  show(options) {
    const {
      message,
      action,
      onActionTouchTap,
    } = options;

    return {
      type: actionTypes.SNACKBAR_SHOW,
      payload: {
        message: message,
        action: action,
        onActionTouchTap: onActionTouchTap,
      },
    };
  },
  dismiss() {
    return {
      type: actionTypes.SNACKBAR_DISMISS,
    };
  },
};

export default actions;
