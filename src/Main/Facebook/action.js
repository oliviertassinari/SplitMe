'use strict';

var dispatcher = require('Main/dispatcher');

var action = {
  login: function() {
    dispatcher.dispatch({
      actionType: 'FACEBOOK_LOGIN',
    });
  },
  updateLoginStatus: function() {
    dispatcher.dispatch({
      actionType: 'FACEBOOK_UPDATE_LOGIN_STATUS',
    });
  },
};

module.exports = action;
