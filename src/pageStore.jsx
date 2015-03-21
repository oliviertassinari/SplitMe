'use strict';

var _ = require('underscore');

var router = require('./router');
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
      router.setRoute('/');
      store.emitChange();
      break;

    case 'EXPENSE_TAP_CLOSE':
    case 'EXPENSE_TAP_SAVE':
    case 'ACCOUNT_TAP_CLOSE':
      switch(_page){
        case 'addExpense':
          _page = 'home';
          router.setRoute('/');
          break;
      }

      store.emitChange();
      break;

    case 'NAVIGATE_ADD_EXPENSE':
    case 'TAP_ADD_EXPENSE':
      _dialog = '';
      _page = 'addExpense';
      router.setRoute('/add');
      store.emitChange();
      break;

    case 'EXPENSE_TAP_LIST':
      _dialog = '';
      _page = 'addExpense';
      router.setRouteAdd('edit');
      store.emitChange();
      break;

    case 'SHOW_DIALOG':
      _dialog = action.name;
      router.setRouteAdd(action.name);
      store.emitChange();
      break;

    case 'DISMISS_DIALOG':
      _dialog = '';
      router.setRouteBack();
      store.emitChange();
      break;

    case 'NAVIGATE_ACCOUNT':
    case 'ACCOUNT_TAP_LIST':
      _dialog = '';
      _page = 'accountDetail';

      if(action.actionType === 'ACCOUNT_TAP_LIST') {
        router.setRoute('/account/' + action.account._id);
      }

      store.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = store;
