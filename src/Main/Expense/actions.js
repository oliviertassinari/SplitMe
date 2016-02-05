import {routeActions} from 'redux-simple-router';

import API from 'API';
import Immutable from 'immutable';
import actionTypes from 'redux/actionTypes';
import modalActions from 'Main/Modal/actions';
import expenseUtils from 'Main/Expense/utils';
import accountActions from 'Main/Account/actions';
import accountUtils from 'Main/Account/utils';
import screenActions from 'Main/Screen/actions';
import routesParser from 'Main/routesParser';

function isValideContact(contact, accountCurrent) {
  if (accountUtils.getAccountMember(accountCurrent, contact.id)) {
    return {
      status: false,
      message: 'contact_add_error.already',
    };
  }

  if (contact.displayName == null) {
    return {
      status: false,
      message: 'contact_add_error.no_name',
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
    return '/account/' + routesParser.expenseEdit.match(pathname).id + '/expenses';
  } else if (routesParser.expenseAdd.match(pathname)) {
    return '/account/' + routesParser.expenseAdd.match(pathname).id + '/expenses';
  } else {
    console.error('called for nothings');
    return false;
  }
}

const actions = {
  fetchAdd(accountId, expenseId) {
    return (dispatch, getState) => {
      const state = getState();

      if (!state.get('accountCurrent')) {
        API.fetchAccountAll().then((accounts) => {
          accountId = API.accountAddPrefixId(accountId);

          const accountCurrent = accounts.find((account) => {
            return account.get('_id') === accountId;
          });

          return API.fetchExpensesOfAccount(accountCurrent);
        }).then((accountCurrent) => {
          dispatch({
            type: actionTypes.EXPENSE_FETCH_ADD,
            payload: {
              accountCurrent: accountCurrent,
              expenseId: expenseId,
            },
          });
        });
      }
    };
  },
  close() {
    return (dispatch, getState) => {
      const state = getState();
      const pathname = state.get('routing').location.pathname;

      dispatch(routeActions.push(getRouteBackExpense(pathname)));
    };
  },
  tapSave() {
    return (dispatch, getState) => {
      const state = getState();
      const isExpenseValide = expenseUtils.isValid(state.get('expenseCurrent'));

      if (isExpenseValide.status) {
        const pathname = state.get('routing').location.pathname;

        dispatch(routeActions.push(getRouteBackExpense(pathname)));
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

          if (routesParser.expenseEdit.match(state.get('routing').location.pathname)) {
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
  addMember(contact, useAsPaidBy, useForExpense = true) {
    return (dispatch, getState) => {
      const isValide = isValideContact(contact, getState().get('accountCurrent'));

      if (isValide.status) {
        let photo = null;

        if (contact.photos) {
          photo = contact.photos[0].value;
        }

        const member = Immutable.fromJS({
          id: contact.id,
          name: contact.displayName,
          email: null,
          photo: photo,
          balances: [],
        });

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

      dispatch(routeActions.push('/account/' + accountId + '/expenses'));
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
