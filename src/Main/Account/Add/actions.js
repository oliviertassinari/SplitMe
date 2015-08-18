'use strict';

var accountActions = require('Main/Account/actions');
var modalActions = require('Main/Modal/actions');
var screenActions = require('Main/Screen/actions');

function isValideAccount(account) {
  if (account.get('share')) {
    // TODO check emails
  }

  return {
    status: true,
  };
}

var actions = {
  changeName: function(name) {
    return {
      type: 'ACCOUNT_ADD_CHANGE_NAME',
      name: name,
    };
  },
  toggleShare: function(share) {
    return {
      type: 'ACCOUNT_ADD_TOGGLE_SHARE',
      share: share,
    };
  },
  changeMemberEmail: function(email, memberId) {
    return {
      type: 'ACCOUNT_ADD_CHANGE_MEMBER_EMAIL',
      email: email,
      memberId: memberId,
    };
  },
  navigateBack: function() {
    return function(dispatch, getState) {
      var state = getState();

      if (state.getIn(['screen', 'dialog']) === '') {
        if (state.get('accountCurrent') !== state.get('accountOpened')) {
          dispatch(modalActions.show({
            actions: [
              { textKey: 'delete', triggerOK: true, triggerName: 'closeAccountAdd' },
              { textKey: 'cancel' },
            ],
            title: 'account_add_confirm_delete_edit',
          }));
        } else {
          dispatch(actions.close());
        }
      } else {
        dispatch(screenActions.dismissDialog());
      }
    };
  },
  close: function() {
    return {
      type: 'ACCOUNT_ADD_CLOSE',
    };
  },
  tapSave: function() {
    return function(dispatch, getState) {
      // if (!_accountCurrent.couchDBDatabaseName && _accountCurrent.share) {
        // TODO
        // call '/account/create' : NEED npm request
        // return couchDBDatabaseName
        // _accountCurrent.couchDBDatabaseName = '';
        // couchDBAction.fetchUser();
        // call '/account/set_right'
      // }

      var state = getState();

      var isAccountValide = isValideAccount(state.get('accountCurrent'));

      if (isAccountValide.status) {
        var accountNew = state.get('accountCurrent');
        var accountOld = state.get('accountOpened');

        dispatch({
          type: 'ACCOUNT_ADD_TAP_SAVE',
        });

        dispatch(accountActions.replaceAccount(accountNew, accountOld, true, true));
      } else {
        modalActions.show({
          actions: [
            { textKey: 'ok' },
          ],
          title: isAccountValide.message,
        });
      }

    };
  },
};

module.exports = actions;
