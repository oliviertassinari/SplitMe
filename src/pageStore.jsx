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
    case 'EXPENSE_TAP_CLOSE':
    case 'EXPENSE_TAP_SAVE':
    case 'ACCOUNT_TAP_CLOSE':
    case 'NAVIGATE_HOME':
      _dialog = '';
      _page = 'home';
      router.setRoute('/', { silent: true });
      store.emitChange();
      break;

    case 'NAVIGATE_ADD_EXPENSE':
    case 'TAP_ADD_EXPENSE':
      _dialog = '';
      _page = 'addExpense';
      router.setRoute('/add', { silent: true });
      store.emitChange();
      break;

    case 'SHOW_DIALOG':
      _dialog = action.name;
      url = router.getPath();
      router.setRoute(url + '/' + action.name, { silent: true });
      store.emitChange();
      break;

    case 'DISMISS_DIALOG':
      _dialog = '';
      url = router.explode();
      url.splice(-1, 1); // Remove last /
      router.setRoute(url.join('/'), { silent: true });
      store.emitChange();
      break;

    case 'ACCOUNT_TAP_LIST':
      _dialog = '';
      _page = 'accountDetail';
      router.setRoute('/account/' + action.account._id, { silent: true });
      store.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = store;
