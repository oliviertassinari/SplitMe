import actionTypes from 'redux/actionTypes';

const actions = {
  dismiss() {
    return {
      type: actionTypes.SNACKBAR_DISMISS,
    };
  },
};

export default actions;
