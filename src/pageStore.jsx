'use strict';

var _ = require('underscore');

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
    case 'EXPENSE_TAP_CLOSE':
      _page = 'home';
      store.emitChange();
      break;

    case 'TAP_ADD_EXPENSE':
      _page = 'addExpense';
      store.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = store;
