'use strict';

var dispatcher = require('Main/dispatcher');

var action = {
  // pickContact: function(contact) {
  //   dispatcher.dispatch({
  //     actionType: 'ACCOUNT_ADD_PICK_CONTACT',
  //     contact: contact,
  //   });
  // },
  changeName: function(name) {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_ADD_CHANGE_NAME',
      name: name,
    });
  },
  toggleShare: function(share) {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_ADD_TOGGLE_SHARE',
      share: share,
    });
  },
  changeMemberEmail: function(email, memberId) {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_ADD_CHANGE_MEMBER_EMAIL',
      email: email,
      memberId: memberId,
    });
  },
  close: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_ADD_CLOSE',
    });
  },
  tapSave: function() {
    dispatcher.dispatch({
      actionType: 'ACCOUNT_ADD_TAP_SAVE',
    });
  },
};

module.exports = action;
