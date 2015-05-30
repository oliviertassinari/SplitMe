'use strict';

var dispatcher = require('Main/dispatcher');

var pageAction = require('Main/pageAction');

var action = {
  show: function(modal) {
    dispatcher.dispatch({
      actionType: 'MODAL_UPDATE',
      modal: modal,
    });
    pageAction.showDialog('modal');
  },
  tapOK: function(triggerName) {
    dispatcher.dispatch({
      actionType: 'MODAL_TAP_OK',
      triggerName: triggerName,
    });
  },
  dismiss: function() {
    pageAction.dismissDialog();
  },
};

module.exports = action;
