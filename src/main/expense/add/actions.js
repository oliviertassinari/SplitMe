import {push} from 'react-router-redux';
import Immutable from 'immutable';

import API from 'API';
import actionTypes from 'redux/actionTypes';
import modalActions from 'main/modal/actions';
import expenseUtils from 'main/expense/utils';
import accountActions from 'main/account/actions';
import accountUtils from 'main/account/utils';
import screenActions from 'main/screen/actions';
import routesParser from 'main/routesParser';

function getRouteBackExpense(pathname) {
  if (pathname === '/expense/add') {
    return '/accounts';
  } else if (routesParser.expenseEdit.match(pathname)) {
    return `/account/${routesParser.expenseEdit.match(pathname).id}/expenses`;
  } else if (routesParser.expenseAdd.match(pathname)) {
    return `/account/${routesParser.expenseAdd.match(pathname).id}/expenses`;
  } else {
    console.error('called for nothings');
    return false;
  }
}

const actions = {
  fetchAdd(accountId, expenseId) {
    return (dispatch, getState) => {
      dispatch(accountActions.fetchList())
      .then(() => {
        if (accountId) {
          dispatch(accountActions.fetchDetail(accountId)).then(() => {
            const state = getState();
            const accountEntry = accountUtils.findEntry(state.get('accounts'), accountId);

            // This accountId can be found
            if (accountEntry) {
              dispatch({
                type: actionTypes.EXPENSE_FETCH_ADD,
                payload: {
                  account: accountEntry[1],
                  expenseId: expenseId,
                },
              });
            }
          });
        } else {
          dispatch({
            type: actionTypes.EXPENSE_FETCH_ADD,
          });
        }
      });
    };
  },
  close() {
    return (dispatch, getState) => {
      const state = getState();
      const pathname = state.get('routing').locationBeforeTransitions.pathname;

      dispatch(push(getRouteBackExpense(pathname)));
    };
  },
  tapSave() {
    return (dispatch, getState) => {
      const state = getState();
      const expense = state.getIn(['expenseAdd', 'expenseCurrent']);
      const isExpenseValide = expenseUtils.isValid(expense);

      if (isExpenseValide.status) {
        const pathname = state.get('routing').locationBeforeTransitions.pathname;

        dispatch(push(getRouteBackExpense(pathname)));
        dispatch({
          type: actionTypes.EXPENSE_TAP_SAVE,
          payload: API.putExpense(expense),
        }).then(() => {
          const newState = getState();
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
  navigateBack() {
    return (dispatch, getState) => {
      const state = getState();

      if (state.getIn(['screen', 'dialog']) === '') {
        if (state.getIn(['expenseAdd', 'expenseCurrent']) !== state.getIn(['expenseAdd', 'expenseOpened'])) {
          let description;

          if (routesParser.expenseEdit.match(state.get('routing').locationBeforeTransitions.pathname)) {
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
  changePaidBy(paidByContactId) {
    return {
      type: actionTypes.EXPENSE_CHANGE_PAID_BY,
      payload: {
        paidByContactId: paidByContactId,
      },
    };
  },
  changeRelatedAccount(relatedAccount) {
    return {
      type: actionTypes.EXPENSE_CHANGE_RELATED_ACCOUNT,
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
          type: actionTypes.EXPENSE_ADD_MEMBER,
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
      type: actionTypes.EXPENSE_CHANGE_PAID_FOR,
      payload: {
        split: split,
        value: value,
        index: index,
      },
    };
  },
  changeCurrent(key, value) {
    return {
      type: actionTypes.EXPENSE_CHANGE_CURRENT,
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
        type: actionTypes.EXPENSE_TAP_DELETE,
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
};

export default actions;
