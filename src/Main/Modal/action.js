'use strict';

var dispatcher = require('../dispatcher');

var actions = {
  update: function(modal) {
    dispatcher.dispatch({
      actionType: 'MODAL_UPDATE',
      modal: modal,
    });
  },
  tapOK: function(triggerName) {
    dispatcher.dispatch({
      actionType: 'MODAL_TAP_OK',
      triggerName: triggerName,
    });
  },
};

module.exports = actions;
