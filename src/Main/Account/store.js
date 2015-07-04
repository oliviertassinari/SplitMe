'use strict';

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

var API = require('API');
var dispatcher = require('Main/dispatcher');
var modalAction = require('Main/Modal/action');
var accountAddAction = require('./Add/action');

var _accounts = [];
var _accountCurrent = null;
var _accountOpen = null;

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


function isValide(account) {
  if (account.name.length === 0) {
    return {
      status: false,
      message: 'account_add_error_empty_name',
    };
  }

  return {
    status: true,
  };
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

    case 'ACCOUNT_TAP_SETTINGS':
      _accountOpen = _accountCurrent;
      _accountCurrent = _.clone(_accountCurrent);
      break;

    case 'ACCOUNT_ADD_CHANGE_NAME':
      _accountCurrent.name = action.name;
      break;

    case 'ACCOUNT_ADD_TAP_SAVE':
      var isAccountValide = isValide(_accountCurrent);

      if (isAccountValide.status) {
        API.putAccount(_accountCurrent).then(function() {
          var index = _accounts.indexOf(_accountOpen);
          _accountOpen = null;
          _accounts[index] = _accountCurrent;
          accountAddAction.tapClose();
        });
      } else {
        // Prevent the dispatch inside a dispatch
        setTimeout(function() {
          modalAction.show({
            actions: [
              { textKey: 'ok' }
            ],
            title: isAccountValide.message,
          });
        });
      }

      break;

    case 'ACCOUNT_ADD_TAP_CLOSE':
      _accountCurrent = _accountOpen;
      _accountOpen = null;
      break;

    case 'MODAL_TAP_OK':
      switch(action.triggerName) {
        case 'closeAccountAdd':
          _accountCurrent = _accountOpen;
          _accountOpen = null;
          break;
      }

      break;

  }
});

module.exports = store;
