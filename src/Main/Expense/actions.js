'use strict';

const utils = require('utils');
const expenseUtils = require('Main/Expense/utils');
const modalActions = require('Main/Modal/actions');
const accountActions = require('Main/Account/actions');
const accountUtils = require('Main/Account/utils');
const screenActions = require('Main/Screen/actions');
const API = require('API');

function isValideExpense(expense) {
  if (!utils.isNumber(expense.get('amount'))) {
    return {
      status: false,
      message: 'expense_add_error.amount_empty',
    };
  }

  if (expense.get('paidByContactId') === null) {
    return {
      status: false,
      message: 'expense_add_error.paid_for_empty',
    };
  }

  if (expenseUtils.getTransfersDueToAnExpense(expense).length === 0) {
    return {
      status: false,
      message: 'expense_add_error.paid_by_empty',
    };
  }

  return {
    status: true,
  };
}

function isValideContact(contact, state) {
  if (accountUtils.getAccountMember(state.get('accountCurrent'), contact.id)) {
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

const actions = {
  close() {
    return {
      type: 'EXPENSE_CLOSE',
    };
  },
  tapSave() {
    return function(dispatch, getState) {
      const state = getState();
      const isExpenseValide = isValideExpense(state.get('expenseCurrent'));

      if (isExpenseValide.status) {
        dispatch({
          type: 'EXPENSE_TAP_SAVE',
        });
        dispatch({
          type: 'EXPENSE_TAP_SAVED',
          payload: API.putExpense(state.get('expenseCurrent')),
          meta: {
            expenseOpened: state.get('expenseOpened'),
          },
        }).then(function() {
          dispatch(accountActions.replaceAccount(
            getState().get('accountCurrent'),
            getState().get('accountOpened'), true, true));
        });
      } else {
        dispatch(modalActions.show(
          [
            {textKey: 'ok'},
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

          if (state.getIn(['screen', 'page']) === 'expenseEdit') {
            description = 'expense_confirm_delete_edit';
          } else {
            description = 'expense_confirm_delete';
          }

          dispatch(modalActions.show(
            [
              {textKey: 'cancel'},
              {textKey: 'delete', dispatchActionType: 'EXPENSE_CLOSE'},
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
  tapList(expense) {
    return {
      type: 'EXPENSE_TAP_LIST',
      expense: expense,
    };
  },
  changePaidBy(paidByContactId) {
    return {
      type: 'EXPENSE_CHANGE_PAID_BY',
      paidByContactId: paidByContactId,
    };
  },
  changeRelatedAccount(relatedAccount) {
    return {
      type: 'EXPENSE_CHANGE_RELATED_ACCOUNT',
      relatedAccount: relatedAccount,
    };
  },
  pickContact(contact, useAsPaidBy) {
    return function(dispatch, getState) {
      const isValide = isValideContact(contact, getState());

      if (isValide.status) {
        dispatch({
          type: 'EXPENSE_PICK_CONTACT',
          contact: contact,
          useAsPaidBy: useAsPaidBy,
        });
      } else {
        dispatch(modalActions.show(
          [
            {textKey: 'ok'},
          ],
          isValide.message
        ));
      }
    };
  },
  changeCurrent(key, value) {
    return {
      type: 'EXPENSE_CHANGE_CURRENT',
      key: key,
      value: value,
    };
  },
  deleteCurrent() {
    return function(dispatch, getState) {
      const state = getState();

      dispatch({
        type: 'EXPENSE_DELETE_CURRENT',
      });

      const newState = getState();
      dispatch(accountActions.replaceAccount(
        newState.get('accountCurrent'), newState.get('accountOpened'), true, true));

      API.removeExpense(state.get('expenseCurrent'));
    };
  },
};

module.exports = actions;
