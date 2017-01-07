// @flow weak

import actionTypes from 'redux/actionTypes';

const screenActions = {
  showDialog(name) {
    return {
      type: actionTypes.SCREEN_SHOW_DIALOG,
      payload: {
        name,
      },
    };
  },
  dismissDialog() {
    return {
      type: actionTypes.SCREEN_DISMISS_DIALOG,
    };
  },
};

export default screenActions;
