'use strict';

var dispatcher = require('Main/dispatcher');

var pageAction = {
  navigateHome: function() {
    dispatcher.dispatch({
      actionType: 'NAVIGATE_HOME',
    });
  },
  navigateSettings: function() {
    dispatcher.dispatch({
      actionType: 'NAVIGATE_SETTINGS',
    });
  },
  showDialog: function(name) {
    dispatcher.dispatch({
      actionType: 'SHOW_DIALOG',
      name: name,
    });
  },
  dismissDialog: function() {
    dispatcher.dispatch({
      actionType: 'DISMISS_DIALOG',
    });
  },
  exitApp: function() {
    dispatcher.dispatch({
      actionType: 'EXIT_APP',
    });
  },
};

module.exports = pageAction;
