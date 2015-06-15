'use strict';

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

var API = require('API');
var dispatcher = require('Main/dispatcher');


var _accounts = [];
var _accountCurrent = null;

var store = _.extend({}, EventEmitter.prototype, {
  getAll: function() {
    return _accounts;
  },
  getCurrent: function() {
    return _accountCurrent;
  },
  newAccountWithOneContact: function(contact) { // no used
    var member = {
      id: contact.id,
      displayName: contact.displayName,
      photo: contact.photos[0].value,
      balances: [],
    };

    return {
      name: contact.displayName,
      dateLastExpense: null,
      members: [{
          id: '0', // Me
          balances: [],
        },
        member,
      ],
      expenses: [],
    };
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
      API.fetchAccountAll().then(function(accounts) {
        _accounts = accounts;

        // Update account current
        if(_accountCurrent) {
          _accountCurrent = _.findWhere(_accounts, { _id: _accountCurrent._id });

          API.fetchExpensesOfAccount(_accountCurrent).then(function() {
            store.emitChange();
          });
        }

        store.emitChange();
      });
      break;

    case 'ACCOUNT_TAP_LIST':
      _accountCurrent = action.account;
      store.emitChange();

      API.fetchExpensesOfAccount(_accountCurrent).then(function() {
        store.emitChange();
      });
      break;

    case 'ACCOUNT_NAVIGATE_HOME':
      _accountCurrent = null;
      store.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = store;
