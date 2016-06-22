import Immutable from 'immutable';

import polyglot from 'polyglot';
import actionTypes from 'redux/actionTypes';
import accountActions from 'main/account/actions';
import modalActions from 'main/modal/actions';
import screenActions from 'main/screen/actions';
import accountUtils from 'main/account/utils';
import routerActions from 'main/routerActions';

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
      dispatch(accountActions.fetchList())
      .then(() => {
        const state = getState();

        if (accountId) {
          const accountEntry = accountUtils.findEntry(
            state.getIn(['account', 'accounts']),
            accountId
          );

          // This accountId can be found
          if (accountEntry) {
            dispatch({
              type: actionTypes.ACCOUNT_ADD_FETCH,
              payload: {
                account: accountEntry[1],
              },
            });
          } else {
            dispatch({
              type: actionTypes.ACCOUNT_ADD_FETCH,
              error: true,
            });
          }
        } else {
          dispatch({
            type: actionTypes.ACCOUNT_ADD_FETCH,
          });
        }
      });
    };
  },
  unmount() {
    return {
      type: actionTypes.ACCOUNT_ADD_UNMOUNT,
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
        dispatch(modalActions.show({
          actionNames: [
            {
              label: polyglot.t('ok'),
            },
          ],
          description: isValide.message,
        }));
      }
    };
  },
  navigateBack(accountId) {
    return (dispatch, getState) => {
      const state = getState();

      if (state.getIn(['screen', 'dialog']) === '') {
        if (state.getIn(['accountAdd', 'allowExit']) === false) {
          let description;

          if (accountId) {
            description = polyglot.t('account_add_confirm_delete_edit');
          } else {
            description = polyglot.t('account_add_confirm_delete');
          }

          dispatch(modalActions.show({
            actionNames: [
              {
                label: polyglot.t('cancel'),
              },
              {
                label: polyglot.t('delete'),
                onTouchTap: () => {
                  dispatch({
                    type: actionTypes.ACCOUNT_ADD_TAP_CLOSE,
                  });
                },
              },
            ],
            description: description,
          }));
        } else {
          dispatch(this.close(accountId));
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

        dispatch(this.close(accountId));

        let accountOpened = null;

        if (accountId) {
          accountOpened = state.getIn(['accountAdd', 'opened']);
        }

        dispatch(accountActions.replaceAccount(accountCurrent, accountOpened));
      } else {
        modalActions.show({
          actionNames: [
            {
              label: polyglot.t('ok'),
            },
          ],
          description: isAccountValide.message,
        });
      }
    };
  },
  close(accountId) {
    let pathname;

    if (accountId) {
      pathname = `/account/${accountId}/expenses`;
    } else {
      pathname = '/accounts';
    }

    return routerActions.goBack(pathname);
  },
};

export default actions;
