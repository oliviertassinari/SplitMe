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

/**
 * Register callback to handle all updates
 */
dispatcher.register(function(action) {
  var url;

  switch(action.actionType) {
    case 'NAVIGATE_HOME':
      _dialog = '';
      _page = 'home';
      store.emitChange();
      break;

    case 'EXPENSE_TAP_CLOSE':
    case 'EXPENSE_TAP_SAVE':
    case 'ACCOUNT_TAP_CLOSE':
      switch(_page){
        case 'addExpense':
        case 'accountDetail':
          _page = 'home';
          break;

        case 'editExpense':
          _page = 'accountDetail';
          break;
      }

      store.emitChange();
      break;

    case 'NAVIGATE_EXPENSE_ADD':
    case 'TAP_ADD_EXPENSE':
      _dialog = '';
      _page = 'addExpense';
      store.emitChange();
      break;

    case 'NAVIGATE_EXPENSE_EDIT':
    case 'EXPENSE_TAP_LIST':
      _dialog = '';
      _page = 'editExpense';
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

    case 'NAVIGATE_ACCOUNT':
    case 'ACCOUNT_TAP_LIST':
      _dialog = '';
      _page = 'accountDetail';
      store.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = store;
