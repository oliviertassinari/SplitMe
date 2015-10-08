'use strict';

const actions = {
  navigateTo(page) {
    return {
      type: 'SCREEN_NAVIGATE_TO',
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
      type: 'SCREEN_SHOW_DIALOG',
      name: name,
    };
  },
  dismissDialog() {
    return {
      type: 'SCREEN_DISMISS_DIALOG',
    };
  },
};

module.exports = actions;
