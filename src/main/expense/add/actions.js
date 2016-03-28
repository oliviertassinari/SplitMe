import {push} from 'react-router-redux';
import Immutable from 'immutable';

import API from 'API';
import actionTypes from 'redux/actionTypes';
import modalActions from 'main/modal/actions';
import expenseUtils from 'main/expense/utils';
import accountActions from 'main/account/actions';
import accountDetailActions from 'main/account/detail/actions';
import accountUtils from 'main/account/utils';
import screenActions from 'main/screen/actions';

function getRouteBackExpense(accountId) {
  if (accountId) {
    return `/account/${accountId}/expenses`;
  } else {
    return '/accounts';
  }
}

function close(accountId) {
  return push(getRouteBackExpense(accountId));
}

const actions = {
  fetchAdd(accountId, expenseId) {
    return (dispatch, getState) => {
      dispatch(accountActions.fetchList())
      .then(() => {
        if (accountId) {
          dispatch(accountDetailActions.fetch(accountId)).then(() => {
            const state = getState();
            const accountEntry = accountUtils.findEntry(
              state.getIn(['account', 'accounts']),
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
        }).then(() => {
          const newState = getState();

          dispatch(push(getRouteBackExpense(accountId)));
          dispatch(accountActions.replaceAccount(
            newState.getIn(['expenseAdd', 'accountCurrent']),
            state.getIn(['expenseAdd', 'accountOpened'])));
        });
      } else {
        dispatch(modalActions.show(
          [
            {
              textKey: 'ok',
            },
          ],
          isExpenseValide.message
        ));
      }
    };
  },
  navigateBack(accountId, expenseId) {
    return (dispatch, getState) => {
      const state = getState();

      if (state.getIn(['screen', 'dialog']) === '') {
        if (state.getIn(['expenseAdd', 'expenseCurrent']) !== state.getIn(['expenseAdd', 'expenseOpened'])) {
          let description;

          if (expenseId) {
            description = 'expense_confirm_delete_edit';
          } else {
            description = 'expense_confirm_delete';
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
  tapDelete(accountId) {
    return (dispatch, getState) => {
      const state = getState();

      const expense = state.getIn(['expenseAdd', 'expenseCurrent']);

      dispatch(push(`/account/${accountId}/expenses`));
      dispatch({
        type: actionTypes.EXPENSE_ADD_TAP_DELETE,
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
  unmount() {
    return {
      type: actionTypes.EXPENSE_ADD_UNMOUNT,
    };
  },
};

export default actions;
