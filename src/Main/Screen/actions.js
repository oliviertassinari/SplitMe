'use strict';

const actionTypes = require('redux/actionTypes');

const actions = {
  navigateTo(page) {
    return {
      type: actionTypes.SCREEN_NAVIGATE_TO,
      page: page,
    };
  },
  navigateBack(action) {
    return function(dispatch, getState) {
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
      name: name,
    };
  },
  dismissDialog() {
    return {
      type: actionTypes.SCREEN_DISMISS_DIALOG,
    };
  },
};

module.exports = actions;
