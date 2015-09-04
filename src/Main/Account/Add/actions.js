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
          dispatch(modalActions.show(
            [
              { textKey: 'cancel' },
              { textKey: 'delete', dispatchActionType: 'ACCOUNT_ADD_CLOSE' },
            ],
            'account_add_confirm_delete_edit'
          ));
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
      var accountNew = state.get('accountCurrent');

      var isAccountValide = isValideAccount(accountNew);

      if (isAccountValide.status) {
        var accountOld = state.get('accountOpened');

        dispatch({
          type: 'ACCOUNT_ADD_TAP_SAVE',
        });

        dispatch(accountActions.replaceAccount(accountNew, accountOld, true, true));
      } else {
        modalActions.show(
          [
            { textKey: 'ok' },
          ],
          isAccountValide.message
        );
      }

    };
  },
};

module.exports = actions;
