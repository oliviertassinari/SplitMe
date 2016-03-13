import {push} from 'react-router-redux';
import Immutable from 'immutable';

import API from 'API';
import actionTypes from 'redux/actionTypes';
import modalActions from 'Main/Modal/actions';
import expenseUtils from 'Main/Expense/utils';
import accountActions from 'Main/Account/actions';
import accountUtils from 'Main/Account/utils';
import screenActions from 'Main/Screen/actions';
import routesParser from 'Main/routesParser';

function isValideMember(member, accountCurrent) {
  if (accountUtils.getAccountMember(accountCurrent, member.get('id'))) {
    return {
      status: false,
      message: 'contact_add_error_already',
    };
  }

  if (member.get('name') == null) {
    return {
      status: false,
      message: 'contact_add_error_no_name',
    };
  }

  return {
    status: true,
  };
}

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
        const state = getState();

        if (accountId) {
          if (!state.get('accountCurrent')) {
            accountId = API.accountAddPrefixId(accountId);

            const accountCurrent = state.get('accounts').find((account) => {
              return account.get('_id') === accountId;
            });

            // This accountId can be found
            if (accountCurrent) {
              API.fetchExpensesOfAccount(accountCurrent)
              .then((accountCurrent2) => {
                dispatch({
                  type: actionTypes.EXPENSE_FETCH_ADD,
                  payload: {
                    accountCurrent: accountCurrent2,
                    expenseId: expenseId,
                  },
                });
              });
            }
          }
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
      const isExpenseValide = expenseUtils.isValid(state.get('expenseCurrent'));

      if (isExpenseValide.status) {
        const pathname = state.get('routing').locationBeforeTransitions.pathname;

        dispatch(push(getRouteBackExpense(pathname)));
        dispatch({
          type: actionTypes.EXPENSE_TAP_SAVE,
          payload: API.putExpense(state.get('expenseCurrent')),
          meta: {
            accountCurrent: state.get('accountCurrent'),
            expenseOpened: state.get('expenseOpened'),
          },
        }).then(() => {
          dispatch(accountActions.replaceAccount(
            getState().get('accountCurrent'),
            state.get('accountOpened'), true, true));
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
        if (state.get('expenseCurrent') !== state.get('expenseOpened')) {
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
  addMember(member, useAsPaidBy, useForExpense = true) {
    return (dispatch, getState) => {
      const isValide = isValideMember(member, getState().get('accountCurrent'));

      if (isValide.status) {
        member = member.set('email', null);
        member = member.set('balances', new Immutable.List());

        dispatch({
          type: actionTypes.EXPENSE_ADD_MEMBER,
          payload: {
            member: member,
            useAsPaidBy: useAsPaidBy,
            useForExpense: useForExpense,
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

      dispatch(push(`/account/${accountId}/expenses`));
      dispatch({
        type: actionTypes.EXPENSE_TAP_DELETE,
        payload: {
          expenseCurrent: state.get('expenseCurrent'),
        },
      });

      const newState = getState();
      dispatch(accountActions.replaceAccount(
        newState.get('accountCurrent'), state.get('accountOpened'), true, true));

      API.removeExpense(state.get('expenseCurrent'));
    };
  },
};

export default actions;
