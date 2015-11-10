import actionTypes from 'redux/actionTypes';

const actions = {
  show(actionsName, description, title) {
    return {
      type: actionTypes.MODAL_UPDATE,
      actions: actionsName,
      title: title,
      description: description,
    };
  },
  dismiss() {
    return {
      type: actionTypes.MODAL_DISMISS,
    };
  },
};

export default actions;
