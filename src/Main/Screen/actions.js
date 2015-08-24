'use strict';

var actions = {
  navigateHome: function() {
    return {
      type: 'SCREEN_NAVIGATE_HOME',
    };
  },
  navigateSettings: function() {
    return {
      type: 'SCREEN_NAVIGATE_SETTINGS',
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
