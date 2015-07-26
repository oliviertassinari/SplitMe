'use strict';

var dispatcher = require('Main/dispatcher');

var action = {
  fetchUser: function() {
    dispatcher.dispatch({
      actionType: 'COUCHDB_FETCH_USER',
    });
  },
};

module.exports = action;
