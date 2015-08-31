'use strict';

var actions = {
  navigateTo: function(page) {
    return {
      type: 'SCREEN_NAVIGATE_TO',
      page: page,
    };
  },
  navigateBack: function(page) {
    return function(dispatch, getState) {
      var state = getState();

      if (state.getIn(['screen', 'dialog']) === '') {
        dispatch(actions.navigateTo(page));
      } else {
        dispatch(actions.dismissDialog());
      }
    };
  },
  showDialog: function(name) {
    return {
      type: 'SCREEN_SHOW_DIALOG',
      name: name,
    };
  },
  dismissDialog: function() {
    return {
      type: 'SCREEN_DISMISS_DIALOG',
    };
  },
};

module.exports = actions;
