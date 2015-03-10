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
    case 'NAVIGATE_HOME':
      _dialog = '';
      _page = 'home';
      router.setRoute('/');
      store.emitChange();
      break;

    case 'NAVIGATE_ADD_EXPENSE':
    case 'TAP_ADD_EXPENSE':
      _dialog = '';
      _page = 'addExpense';
      router.setRoute('/add');
      store.emitChange();
      break;

    case 'SHOW_DIALOG':
      _dialog = action.name;
      url = router.explode();
      router.setRoute(url.length, action.name);
      store.emitChange();
      break;

    case 'DISMISS_DIALOG':
      _dialog = '';
      url = router.explode();
      url.splice(-1, 1); // Remove last /
      router.setRoute(url.join('/'));
      store.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = store;
