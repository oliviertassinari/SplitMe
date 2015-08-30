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
    state = Immutable.fromJS({
      page: 'home',
      dialog: '',
    });
  }

  switch (action.type) {
    case 'SCREEN_NAVIGATE_TO':
      state = state.set('page', action.page);
      return state;

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
      state = state.set('page', getPageBeforeAddExpense(state.get('page')));
      return state;

    case 'ACCOUNT_TAP_ADD_EXPENSE':
      state = state.set('page', 'addExpense');
      return state;

    case 'EXPENSE_TAP_LIST':
      state = state.set('page', 'editExpense');
      return state;

    case 'ACCOUNT_TAP_ADD_EXPENSE_FOR_ACCOUNT':
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
    case 'COUCHDB_TAP_IMPORTED':
      state = state.set('dialog', '');
      return state;

    case 'ACCOUNT_ADD_TAP_SAVE':
    case 'ACCOUNT_ADD_CLOSE':
    case 'ACCOUNT_TAP_LIST':
      state = state.set('page', 'accountDetail');
      return state;

    case 'ACCOUNT_NAVIGATE_HOME':
      state = state.set('page', 'home');
      return state;

    case 'ACCOUNT_TAP_SETTINGS':
      state = state.set('page', 'accountAdd');
      return state;

    case 'COUCHDB_TAP_IMPORT':
      state = state.set('dialog', 'import');
      return state;

    case 'COUCHDB_TAP_EXPORT':
      state = state.set('dialog', 'export');
      return state;

    default:
      return state;
  }
}

module.exports = reducer;
