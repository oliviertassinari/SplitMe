import actionTypes from 'redux/actionTypes';

const actions = {
  show(message) {
    return {
      type: actionTypes.SNACKBAR_SHOW,
      message: message,
    };
  },
  dismiss() {
    return {
      type: actionTypes.SNACKBAR_DISMISS,
    };
  },
};

export default actions;
