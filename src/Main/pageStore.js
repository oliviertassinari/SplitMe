'use strict';

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

var dispatcher = require('Main/dispatcher');

var _page = 'home';
var _dialog = '';

var store = _.extend({}, EventEmitter.prototype, {
  get: function() {
    return _page;
  },
  getDialog: function() {
    return _dialog;
  },
  emitChange: function() {
    this.emit('change');
  },
  addChangeListener: function(callback) {
    this.on('change', callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  },
});

function navigateBackFromAddExpense() {
  switch(_page) {
    case 'addExpense':
      _page = 'home';
      break;

    case 'editExpense':
    case 'addExpenseForAccount':
      _page = 'accountDetail';
      break;
  }
}

/**
 * Register callback to handle all updates
 */
dispatcher.register(function(action) {
  switch(action.actionType) {
    case 'EXIT_APP':
      if (process.env.NODE_ENV === 'production') {
        navigator.app.exitApp();
      } else {
        console.info('navigator.app.exitApp()');
      }
      break;

    case 'MODAL_TAP_OK':
      switch(action.triggerName) {
        case 'closeAccountAdd':
        case 'deleteExpenseCurrent':
          _page = 'accountDetail';
          store.emitChange();
          break;

        case 'closeExpenseCurrent':
          navigateBackFromAddExpense();
          store.emitChange();
          break;
      }
      break;

    case 'EXPENSE_CLOSE':
      navigateBackFromAddExpense();
      store.emitChange();
      break;

    case 'TAP_ADD_EXPENSE':
      _dialog = '';
      _page = 'addExpense';
      store.emitChange();
      break;

    case 'EXPENSE_TAP_LIST':
      _dialog = '';
      _page = 'editExpense';
      store.emitChange();
      break;

    case 'TAP_ADD_EXPENSE_FOR_ACCOUNT':
      _dialog = '';
      _page = 'addExpenseForAccount';
      store.emitChange();
      break;

    case 'SHOW_DIALOG':
      _dialog = action.name;
      store.emitChange();
      break;

    case 'DISMISS_DIALOG':
      _dialog = '';
      store.emitChange();
      break;

    case 'ACCOUNT_ADD_CLOSE':
    case 'ACCOUNT_TAP_EXPENSES':
    case 'ACCOUNT_TAP_LIST':
      _dialog = '';
      _page = 'accountDetail';
      store.emitChange();
      break;

    case 'ACCOUNT_NAVIGATE_HOME':
    case 'NAVIGATE_HOME':
      _page = 'home';
      store.emitChange();
      break;

    case 'NAVIGATE_SETTINGS':
      _page = 'settings';
      store.emitChange();
      break;

    case 'ACCOUNT_TAP_BALANCE':
      _page = 'accountDetailBalance';
      store.emitChange();
      break;

    case 'ACCOUNT_TAP_DEBTS':
      _page = 'accountDetailDebts';
      store.emitChange();
      break;

    case 'ACCOUNT_TAP_SETTINGS':
      _page = 'accountAdd';
      store.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = store;
