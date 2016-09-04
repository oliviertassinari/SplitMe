// @flow weak

import Immutable from 'immutable';
import polyglot from 'polyglot';
import API from 'API';
import actionTypes from 'redux/actionTypes';
import modalActions from 'main/modal/actions';
import expenseUtils from 'main/expense/utils';
import accountActions from 'main/account/actions';
import accountDetailActions from 'main/account/detail/actions';
import accountUtils from 'main/account/utils';
import screenActions from 'main/screen/actions';
import routerActions from 'main/routerActions';

const actions = {
  fetchAdd(accountId, expenseId) {
    return (dispatch, getState) => {
      dispatch(accountActions.fetchList())
        .then(() => {
          if (accountId) {
            dispatch(accountDetailActions.fetch(accountId))
            .then(() => {
              const state = getState();
              const accountEntry = accountUtils.findEntry(
                state.getIn(['account', 'accounts', 'payload']),
                accountId
              );

              // This accountId can be found
              if (accountEntry) {
                dispatch({
                  type: actionTypes.EXPENSE_ADD_FETCH,
                  payload: {
                    account: accountEntry[1],
                    expenseId: expenseId,
                  },
                });
              } else {
                dispatch({
                  type: actionTypes.EXPENSE_ADD_FETCH,
                  error: true,
                });
              }
            });
          } else {
            dispatch({
              type: actionTypes.EXPENSE_ADD_FETCH,
            });
          }
        });
    };
  },
  tapSave(accountId) {
    return (dispatch, getState) => {
      const state = getState();
      const expense = state.getIn(['expenseAdd', 'expenseCurrent']);
      const isExpenseValide = expenseUtils.isValid(expense);

      if (isExpenseValide.status) {
        dispatch({
          type: actionTypes.EXPENSE_ADD_TAP_SAVE,
          payload: API.putExpense(expense),
        }).then((action) => {
          if (!action.error) {
            const newState = getState();

            dispatch(this.close(accountId));
            dispatch(accountActions.replaceAccount(
              newState.getIn(['expenseAdd', 'accountCurrent']),
              state.getIn(['expenseAdd', 'accountOpened'])));
          }
        });
      } else {
        dispatch(modalActions.show({
          actionNames: [
            {
              label: polyglot.t('ok'),
            },
          ],
          description: isExpenseValide.message,
        }));
      }
    };
  },
  navigateBack(accountId, expenseId) {
    return (dispatch, getState) => {
      const state = getState();

      if (state.getIn(['screen', 'dialog']) === '') {
        if (state.getIn(['expenseAdd', 'allowExit']) === false) {
          let description;

          if (expenseId) {
            description = polyglot.t('expense_confirm_delete_edit');
          } else {
            description = polyglot.t('expense_confirm_delete');
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
                    type: actionTypes.EXPENSE_ADD_TAP_CLOSE,
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
  changePaidBy(paidByContactId) {
    return {
      type: actionTypes.EXPENSE_ADD_CHANGE_PAID_BY,
      payload: {
        paidByContactId: paidByContactId,
      },
    };
  },
  changeRelatedAccount(relatedAccount) {
    return {
      type: actionTypes.EXPENSE_ADD_CHANGE_RELATED_ACCOUNT,
      payload: {
        relatedAccount: relatedAccount,
      },
    };
  },
  addMember(member, useAsPaidBy) {
    return (dispatch, getState) => {
      const account = getState().getIn(['expenseAdd', 'accountCurrent']);
      const isValide = accountUtils.isValideMember(account, member);

      if (isValide.status) {
        member = member.set('email', null);
        member = member.set('balances', new Immutable.List());

        dispatch({
          type: actionTypes.EXPENSE_ADD_ADD_MEMBER,
          payload: {
            member: member,
            useAsPaidBy: useAsPaidBy,
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
  changePaidFor(split, value, index) {
    return {
      type: actionTypes.EXPENSE_ADD_CHANGE_PAID_FOR,
      payload: {
        split: split,
        value: value,
        index: index,
      },
    };
  },
  changeCurrent(key, value) {
    return {
      type: actionTypes.EXPENSE_ADD_CHANGE_CURRENT,
      payload: {
        key: key,
        value: value,
      },
    };
  },
  tapDeleteConfirm() {
    return (dispatch, getState) => {
      const state = getState();
      const expense = state.getIn(['expenseAdd', 'expenseCurrent']);

      dispatch({
        type: actionTypes.EXPENSE_ADD_DELETE_CONFIRM,
        payload: {
          expense: expense,
        },
      });

      const newState = getState();
      dispatch(accountActions.replaceAccount(
        newState.getIn(['expenseAdd', 'accountCurrent']),
        state.getIn(['expenseAdd', 'accountOpened'])));

      API.removeExpense(expense);
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
  unmount() {
    return {
      type: actionTypes.EXPENSE_ADD_UNMOUNT,
    };
  },
};

export default actions;
