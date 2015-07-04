'use strict';

var dispatcher = require('Main/dispatcher');

var action = {
  pickContact: function(contact) {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_ADD_PICK_CONTACT',
      contact: contact,
    });
  },
  changeName: function(name) {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_ADD_CHANGE_NAME',
      name: name,
    });
  },
  tapClose: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_ADD_TAP_CLOSE',
    });
  },
  tapSave: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_ADD_TAP_SAVE',
    });
  },
};

module.exports = action;
