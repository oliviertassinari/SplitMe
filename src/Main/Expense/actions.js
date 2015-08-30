'use strict';

var utils = require('utils');
var Immutable = require('immutable');
var modalActions = require('Main/Modal/actions');
var accountActions = require('Main/Account/actions');
var screenActions = require('Main/Screen/actions');
var API = require('API');

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

  if (utils.getTransfersDueToAnExpense(expense).length === 0) {
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
  if (utils.getAccountMember(state.get('accountCurrent'), contact.id)) {
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

var actions = {
  close: function() {
    return {
      type: 'EXPENSE_CLOSE',
    };
  },
  tapSave: function() {
    return function(dispatch, getState) {
      var state = getState();

      var isExpenseValide = isValideExpense(state.get('expenseCurrent'));

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
            { textKey: 'ok' },
          ],
          isExpenseValide.message
        ));
      }
    };
  },
  navigateBack: function() {
    return function(dispatch, getState) {
      var state = getState();

      if (state.getIn(['screen', 'dialog']) === '') {
        if (state.get('expenseCurrent') !== state.get('expenseOpened')) {
          var title;

          if (state.getIn(['screen', 'page']) === 'editExpense') {
            title = 'expense_confirm_delete_edit';
          } else {
            title = 'expense_confirm_delete';
          }

          dispatch(modalActions.show(
            [
              { textKey: 'delete', triggerOK: true, triggerName: 'closeExpenseCurrent' },
              { textKey: 'cancel' },
            ],
            title
          ));
        } else {
          dispatch(actions.close());
        }
      } else {
        dispatch(screenActions.dismissDialog());
      }
    };
  },
  tapList: function(expense) {
    return {
      type: 'EXPENSE_TAP_LIST',
      expense: expense,
    };
  },
  changePaidBy: function(paidByContactId) {
    return {
      type: 'EXPENSE_CHANGE_PAID_BY',
      paidByContactId: paidByContactId,
    };
  },
  changeRelatedAccount: function(relatedAccount) {
    return {
      type: 'EXPENSE_CHANGE_RELATED_ACCOUNT',
      relatedAccount: relatedAccount,
    };
  },
  pickContact: function(contact, useAsPaidBy) {
    return function(dispatch, getState) {
      var isValide = isValideContact(contact, getState());

      if (isValide.status) {
        dispatch({
          type: 'EXPENSE_PICK_CONTACT',
          contact: contact,
          useAsPaidBy: useAsPaidBy,
        });
      } else {
        dispatch(modalActions(isValide.message, Immutable.fromJS([
          {
            textKey: 'ok',
          },
        ])));
      }
    };
  },
  changeCurrent: function(key, value) {
    return {
      type: 'EXPENSE_CHANGE_CURRENT',
      key: key,
      value: value,
    };
  },
};

module.exports = actions;
