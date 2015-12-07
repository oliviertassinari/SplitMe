import {push} from 'redux-router';

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
  changeName(name) {
    return {
      type: actionTypes.ACCOUNT_ADD_CHANGE_NAME,
      name: name,
    };
  },
  toggleShare(share) {
    return {
      type: actionTypes.ACCOUNT_ADD_TOGGLE_SHARE,
      share: share,
    };
  },
  changeMemberEmail(email, memberId) {
    return {
      type: actionTypes.ACCOUNT_ADD_CHANGE_MEMBER_EMAIL,
      email: email,
      memberId: memberId,
    };
  },
  navigateBack() {
    return (dispatch, getState) => {
      const state = getState();

      if (state.getIn(['screen', 'dialog']) === '') {
        if (state.get('accountCurrent') !== state.get('accountOpened')) {
          let description;

          if (state.get('router').routes[1].path === 'account/:id/edit') {
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
                dispatchAction: actions.close,
              },
            ],
            description
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
    return (dispatch, getState) => {
      const state = getState();
      const router = state.get('router');

      switch (router.routes[1].path) {
        case 'account/add':
          dispatch(push('/'));
          break;

        case 'account/:id/edit':
          dispatch(push('/account/' + router.params.id + '/expenses'));
          break;

        default:
          console.error('called for nothings');
          break;
      }
    };
  },
  tapSave() {
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
        const router = state.get('router');

        if (router.params.id) {
          dispatch(push('/account/' + router.params.id + '/expenses'));
        } else {
          dispatch(push('/'));
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
            {textKey: 'ok'},
          ],
          isAccountValide.message
        );
      }

    };
  },
};

export default actions;
