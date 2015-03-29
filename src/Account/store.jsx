'use strict';

var _ = require('underscore');

var API = require('../API');
var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var Lie = require('lie');


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

function fetchForAccountCurrent(account) {
  return new Lie(function(resolve) {
    API.fetchExpensesOfAccount(account).then(function(firstFetched) {
      if(firstFetched) {
        API.fetchAccountsNext(account).then(function(newData) {
          resolve();
        });
      }
    });
  });
}

/**
 * Register callback to handle all updates
 */
dispatcher.register(function(action) {
  switch(action.actionType) {
    case 'ACCOUNT_FETCH_ALL':
      API.fetchAccountAll().then(function(accounts) {
        _accounts = accounts;

        // Update account current
        if(_accountCurrent) {
          _accountCurrent = _.findWhere(_accounts, { _id: _accountCurrent._id });

          fetchForAccountCurrent(_accountCurrent).then(function() {
            store.emitChange();
          });
        }

        store.emitChange();
      });
      break;

    case 'NAVIGATE_ACCOUNT':
    case 'ACCOUNT_TAP_LIST':
      _accountCurrent = action.account;
      store.emitChange();

      fetchForAccountCurrent(action.account).then(function() {
        store.emitChange();
      });
      break;

    default:
      // no op
  }
});

module.exports = store;
