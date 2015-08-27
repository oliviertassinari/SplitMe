'use strict';

var actions = {
  navigateTo: function(page) {
    return {
      type: 'SCREEN_NAVIGATE_TO',
      page: page,
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
