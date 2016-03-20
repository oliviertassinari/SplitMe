import {push} from 'react-router-redux';
import Immutable from 'immutable';

import actionTypes from 'redux/actionTypes';
import accountActions from 'main/account/actions';
import modalActions from 'main/modal/actions';
import screenActions from 'main/screen/actions';
import accountUtils from 'main/account/utils';

function isValideAccount(account) {
  if (account.get('share')) {
    // TODO check emails
  }

  return {
    status: true,
  };
}

function close(accountId) {
  if (accountId) {
    return push(`/account/${accountId}/expenses`);
  } else {
    return push('/accounts');
  }
}

const actions = {
  fetchAdd(accountId) {
    return (dispatch, getState) => {
      dispatch(accountActions.fetchList())
      .then(() => {
        const state = getState();

        if (accountId) {
          const accountEntry = accountUtils.findEntry(state.get('accounts'), accountId);

          // This accountId can be found
          if (accountEntry) {
            dispatch({
              type: actionTypes.ACCOUNT_ADD_FETCH_ADD,
              payload: {
                account: accountEntry[1],
              },
            });
          }
        } else {
          dispatch({
            type: actionTypes.ACCOUNT_ADD_FETCH_ADD,
          });
        }
      });
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
  addMember(member) {
    return (dispatch, getState) => {
      const state = getState();
      const isValide = accountUtils.isValideMember(state.getIn(['accountAdd', 'current']), member);

      if (isValide.status) {
        member = member.set('email', null);
        member = member.set('balances', new Immutable.List());

        dispatch({
          type: actionTypes.ACCOUNT_ADD_ADD_MEMBER,
          payload: {
            member: member,
          },
        });
      } else {
        dispatch(modalActions.show(
          [
            {
              textKey: 'ok',
            },
          ],
          isValide.message
        ));
      }
    };
  },
  navigateBack(accountId) {
    return (dispatch, getState) => {
      const state = getState();

      if (state.getIn(['screen', 'dialog']) === '') {
        if (state.getIn(['accountAdd', 'current']) !== state.getIn(['accountAdd', 'opened'])) {
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
                  return close(accountId);
                },
              },
            ],
            description
          ));
        } else {
          dispatch(close(accountId));
        }
      } else {
        dispatch(screenActions.dismissDialog());
      }
    };
  },
  tapSave(accountId) {
    return (dispatch, getState) => {
      const state = getState();
      const isAccountValide = isValideAccount(state.getIn(['accountAdd', 'current']));

      if (isAccountValide.status) {
        dispatch({
          type: actionTypes.ACCOUNT_ADD_TAP_SAVE,
        });

        const accountCurrent = getState().getIn(['accountAdd', 'current']);

        if (accountId) {
          dispatch(accountActions.replaceAccount(accountCurrent,
            state.getIn(['accountAdd', 'opened'])))
          .then(() => {
            dispatch(push(`/account/${accountId}/expenses`));
          });
        } else {
          dispatch(accountActions.replaceAccount(accountCurrent, null))
          .then(() => {
            dispatch(push('/accounts'));
          });
        }
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
