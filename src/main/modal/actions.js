import actionTypes from 'redux/actionTypes';

const modalActions = {
  show(options) {
    const { actionNames, description, title } = options;

    return {
      type: actionTypes.MODAL_UPDATE,
      payload: {
        actions: actionNames,
        title,
        description,
      },
    };
  },
  dismiss() {
    return {
      type: actionTypes.MODAL_DISMISS,
    };
  },
};

export default modalActions;
