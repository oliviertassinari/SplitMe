import {push} from 'react-router-redux';

import API from 'API';
import actionTypes from 'redux/actionTypes';
import accountActions from 'Main/Account/actions';
import modalActions from 'Main/Modal/actions';
import screenActions from 'Main/Screen/actions';

function isValideAccount(account) {
  if (account.get('share')) {
    // TODO check emails
  }

  return {
    status: true,
  };
}

const actions = {
  fetchAdd(accountId) {
    return (dispatch, getState) => {
      const state = getState();

      if (!state.get('accountCurrent')) {
        API.fetchAccountAll().then((accounts) => {
          accountId = API.accountAddPrefixId(accountId);

          const account = accounts.find((account2) => {
            return account2.get('_id') === accountId;
          });

          dispatch({
            type: actionTypes.ACCOUNT_ADD_FETCH_ADD,
            payload: {
              account: account,
            },
          });
        });
      }
    };
  },
  changeName(name) {
    return {
      type: actionTypes.ACCOUNT_ADD_CHANGE_NAME,
      payload: {
        name: name,
      },
    };
  },
  toggleShare(share) {
    return {
      type: actionTypes.ACCOUNT_ADD_TOGGLE_SHARE,
      payload: {
        share: share,
      },
    };
  },
  changeMemberEmail(email, memberId) {
    return {
      type: actionTypes.ACCOUNT_ADD_CHANGE_MEMBER_EMAIL,
      payload: {
        email: email,
        memberId: memberId,
      },
    };
  },
  navigateBack(accountId) {
    return (dispatch, getState) => {
      const state = getState();

      if (state.getIn(['screen', 'dialog']) === '') {
        if (state.get('accountCurrent') !== state.get('accountOpened')) {
          let description;

          if (accountId) {
            description = 'account_add_confirm_delete_edit';
          } else {
            description = 'account_add_confirm_delete';
          }

          dispatch(modalActions.show(
            [
              {
                textKey: 'cancel',
              },
              {
                textKey: 'delete',
                dispatchAction: () => {
                  return actions.close(accountId);
                },
              },
            ],
            description
          ));
        } else {
          dispatch(actions.close(accountId));
        }
      } else {
        dispatch(screenActions.dismissDialog());
      }
    };
  },
  close(accountId) {
    return (dispatch) => {
      if (accountId) {
        dispatch(push(`/account/${accountId}/expenses`));
      } else {
        dispatch(push('/accounts'));
      }
    };
  },
  tapSave(accountId) {
    return (dispatch, getState) => {
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
        if (accountId) {
          dispatch(push(`/account/${accountId}/expenses`));
        } else {
          dispatch(push('/accounts'));
        }

        dispatch({
          type: actionTypes.ACCOUNT_ADD_TAP_SAVE,
          payload: {
            accountCurrent: state.get('accountCurrent'),
          },
        });

        const newState = getState();
        dispatch(accountActions.replaceAccount(newState.get('accountCurrent'),
          state.get('accountOpened'), true, true));
      } else {
        modalActions.show(
          [
            {
              textKey: 'ok',
            },
          ],
          isAccountValide.message
        );
      }
    };
  },
};

export default actions;
