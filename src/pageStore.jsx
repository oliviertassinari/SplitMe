'use strict';

var _ = require('underscore');

var router = require('./router');
var dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;

var _page = 'home';

var store = _.extend({}, EventEmitter.prototype, {
  get: function() {
    return _page;
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
  switch(action.actionType) {
    case 'NAVIGATE_HOME':
    case 'EXPENSE_TAP_CLOSE':
    case 'EXPENSE_TAP_SAVE':
      _page = 'home';
      router.setRoute('/');
      store.emitChange();
      break;

    case 'NAVIGATE_ADD_EXPENSE':
    case 'TAP_ADD_EXPENSE':
      _page = 'addExpense';
      router.setRoute('/add');
      store.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = store;
