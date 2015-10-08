'use strict';

const accountActions = require('Main/Account/actions');
const modalActions = require('Main/Modal/actions');
const screenActions = require('Main/Screen/actions');

function isValideAccount(account) {
  if (account.get('share')) {
    // TODO check emails
  }

  return {
    status: true,
  };
}

const actions = {
  changeName(name) {
    return {
      type: 'ACCOUNT_ADD_CHANGE_NAME',
      name: name,
    };
  },
  toggleShare(share) {
    return {
      type: 'ACCOUNT_ADD_TOGGLE_SHARE',
      share: share,
    };
  },
  changeMemberEmail(email, memberId) {
    return {
      type: 'ACCOUNT_ADD_CHANGE_MEMBER_EMAIL',
      email: email,
      memberId: memberId,
    };
  },
  navigateBack() {
    return function(dispatch, getState) {
      const state = getState();

      if (state.getIn(['screen', 'dialog']) === '') {
        if (state.get('accountCurrent') !== state.get('accountOpened')) {
          dispatch(modalActions.show(
            [
              {textKey: 'cancel'},
              {textKey: 'delete', dispatchActionType: 'ACCOUNT_ADD_CLOSE'},
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
  close() {
    return {
      type: 'ACCOUNT_ADD_CLOSE',
    };
  },
  tapSave() {
    return function(dispatch, getState) {
      // if (!_accountCurrent.couchDBDatabaseName && _accountCurrent.share) {
        // TODO
        // call '/account/create' : NEED npm request
        // return couchDBDatabaseName
        // _accountCurrent.couchDBDatabaseName = '';
        // couchDBAction.fetchUser();
        // call '/account/set_right'
      // }

      const state = getState();
      const isAccountValide = isValideAccount(state.get('accountCurrent'));

      if (isAccountValide.status) {
        const accountOld = state.get('accountOpened');

        dispatch({
          type: 'ACCOUNT_ADD_TAP_SAVE',
        });

        const newState = getState();
        dispatch(accountActions.replaceAccount(newState.get('accountCurrent'), accountOld, true, true));
      } else {
        modalActions.show(
          [
            {textKey: 'ok'},
          ],
          isAccountValide.message
        );
      }

    };
  },
};

module.exports = actions;
