'use strict';

var Immutable = require('immutable');

function getPageBeforeAddExpense(page) {
  switch (page) {
    case 'addExpense':
      return 'home';

    case 'editExpense':
    case 'addExpenseForAccount':
      return 'accountDetail';

    default:
      console.warn('getPageBeforeAddExpense() called for nothings');
      return page;
  }
}

function reducer(state, action) {
  if (state === undefined) {
    state = new Immutable.Map();
  }

  switch (action.type) {
    case 'MODAL_TAP_OK':
      switch (action.triggerName) {
        case 'closeAccountAdd':
        case 'deleteExpenseCurrent':
          state = state.set('page', 'accountDetail');
          break;

        case 'closeExpenseCurrent':
          state = state.set('page', getPageBeforeAddExpense(state.get('page')));
          break;
      }
      return state;

    case 'EXPENSE_TAP_SAVE':
    case 'EXPENSE_CLOSE':
      state = state.get('page', getPageBeforeAddExpense(state.get('page')));
      return state;

    case 'ACCOUNT_TAP_ADD_EXPENSE':
      state = state.set('dialog', '');
      state = state.set('page', 'addExpense');
      return state;

    case 'EXPENSE_TAP_LIST':
      state = state.set('dialog', '');
      state = state.set('page', 'editExpense');
      return state;

    case 'ACCOUNT_TAP_ADD_EXPENSE_FOR_ACCOUNT':
      state = state.set('dialog', '');
      state = state.set('page', 'addExpenseForAccount');
      return state;

    case 'MODAL_UPDATE':
      state = state.set('dialog', 'modal');
      return state;

    case 'SCREEN_SHOW_DIALOG':
      state = state.set('dialog', action.name);
      return state;

    case 'MODAL_DISMISS':
    case 'SCREEN_DISMISS_DIALOG':
    case 'EXPENSE_CHANGE_PAID_BY':
    case 'EXPENSE_CHANGE_RELATED_ACCOUNT':
      state = state.set('dialog', '');
      return state;

    case 'ACCOUNT_ADD_TAP_SAVE':
    case 'ACCOUNT_ADD_CLOSE':
    case 'ACCOUNT_TAP_EXPENSES':
    case 'ACCOUNT_TAP_LIST':
      state = state.set('dialog', '');
      state = state.set('page', 'accountDetail');
      return state;

    case 'ACCOUNT_NAVIGATE_HOME':
    case 'SCREEN_NAVIGATE_HOME':
      state = state.set('page', 'home');
      return state;

    case 'SCREEN_NAVIGATE_SETTINGS':
      state = state.set('page', 'settings');
      return state;

    case 'ACCOUNT_TAP_BALANCE':
      state = state.set('page', 'accountDetailBalance');
      return state;

    case 'ACCOUNT_TAP_DEBTS':
      state = state.set('page', 'accountDetailDebts');
      return state;

    case 'ACCOUNT_TAP_SETTINGS':
      state = state.set('page', 'accountAdd');
      return state;

    default:
      return state;
  }
}

module.exports = reducer;
