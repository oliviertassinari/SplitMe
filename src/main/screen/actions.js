// @flow weak

import actionTypes from 'redux/actionTypes';

const actions = {
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
