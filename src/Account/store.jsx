'use strict';

var _ = require('underscore');

var API = require('../API');
var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;


var _accounts = [];
var _accountCurrent = null;

var store = _.extend({}, EventEmitter.prototype, {
  getAll: function() {
    return _accounts;
  },
  getCurrent: function() {
    return _accountCurrent;
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
    case 'ACCOUNT_FETCH_ALL':
      API.fetchAccountAll().then(function(result) {
        _accounts = result;
        store.emitChange();
      });
      break;

    case 'ACCOUNT_TAP':
      console.log('ACCOUNT_TAP');
      break;

    default:
      // no op
  }
});

module.exports = store;
