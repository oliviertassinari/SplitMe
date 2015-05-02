'use strict';

var _ = require('underscore');

var dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;

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
  }
});

function navigateBack() {
  if (_dialog !== '') {
    _dialog = '';
  } else {
    switch(_page) {
      case 'addExpense':
      case 'accountDetail':
        _page = 'home';
        break;

      case 'editExpense':
      case 'addExpenseForAccount':
        _page = 'accountDetail';
        break;

      case 'home':
        if (process.env.NODE_ENV === 'production') {
          navigator.app.exitApp();
        } else {
          console.log('navigator.app.exitApp()');
        }
        break;
    }
  }
}

/**
 * Register callback to handle all updates
 */
dispatcher.register(function(action) {
  switch(action.actionType) {
    case 'MODAL_TAP_OK':
      switch(action.triggerName) {
        case 'deleteExpenseCurrent':
          _page = 'accountDetail';
          break;

        case 'closeExpenseCurrent':
          navigateBack();
          break;
      }

      store.emitChange();
      break;

    case 'ACCOUNT_NAVIGATE_BACK':
      _dialog = '';
      _page = 'home';
      store.emitChange();
      break;

    case 'NAVIGATE_BACK':
    case 'EXPENSE_TAP_CLOSE':
    case 'ACCOUNT_TAP_CLOSE':
      navigateBack();
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

    case 'ACCOUNT_TAP_LIST':
      _dialog = '';
      _page = 'accountDetail';
      store.emitChange();
      break;

    case 'NAVIGATE_HOME':
      _page = 'home';
      store.emitChange();
      break;

    case 'NAVIGATE_SETTINGS':
      _page = 'settings';
      store.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = store;
