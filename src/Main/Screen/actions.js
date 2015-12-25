import actionTypes from 'redux/actionTypes';

const actions = {
  navigateBack(action) {
    return (dispatch, getState) => {
      const state = getState();

      if (state.getIn(['screen', 'dialog']) === '') {
        dispatch(action);
      } else {
        dispatch(actions.dismissDialog());
      }
    };
  },
  showDialog(name) {
    return {
      type: actionTypes.SCREEN_SHOW_DIALOG,
      payload: {
        name: name,
      },
    };
  },
  dismissDialog() {
    return {
      type: actionTypes.SCREEN_DISMISS_DIALOG,
    };
  },
};

export default actions;
