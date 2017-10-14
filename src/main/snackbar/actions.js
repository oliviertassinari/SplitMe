import actionTypes from 'redux/actionTypes';

const snackbarActions = {
  show(options) {
    const { message, action, onActionTouchTap } = options;

    return {
      type: actionTypes.SNACKBAR_SHOW,
      payload: {
        message,
        action,
        onActionTouchTap,
      },
    };
  },
  dismiss() {
    return {
      type: actionTypes.SNACKBAR_DISMISS,
    };
  },
};

export default snackbarActions;
