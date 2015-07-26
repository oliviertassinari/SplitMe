'use strict';

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

var API = require('API');
var utils = require('utils');
var dispatcher = require('Main/dispatcher');
var modalAction = require('Main/Modal/action');
var accountAddAction = require('./Add/action');
var couchDBAction = require('./action');

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
  },
});


function isValide(account) {
  if (account.share) {
    // TODO check emails
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
        if(_accountCurrent && _accountCurrent._id) {
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

      if (!API.isExpensesFetched(_accountCurrent.expenses)) {
        API.fetchExpensesOfAccount(_accountCurrent).then(function() {
          store.emitChange();
        });
      }
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

    case 'ACCOUNT_ADD_TOGGLE_SHARE':
      _accountCurrent.share = action.share;
      store.emitChange();
      break;

    case 'ACCOUNT_ADD_CHANGE_MEMBER_EMAIL':
      var member = utils.getAccountMember(_accountCurrent, action.memberId);
      member.email = action.email;
      store.emitChange();
      break;

    case 'ACCOUNT_ADD_TAP_SAVE':
      var isAccountValide = isValide(_accountCurrent);

      // Prevent the dispatch inside a dispatch
      setTimeout(function() {
        if (isAccountValide.status) {
          if (!_accountCurrent.couchDBDatabaseName && _accountCurrent.share) {
            // TODO
            // call '/account/create' : NEED npm request
            // return couchDBDatabaseName
            // _accountCurrent.couchDBDatabaseName = '';
            // couchDBAction.fetchUser();
            // call '/account/set_right'
          }

          /**
           * Will set _accountCurrent to _accountOpen and _accountOpen to null,
           * we save them before.
           * By trigger tapClose, only one ACCOUNT_ADD_TAP_SAVE can be triggered.
           */
          var accountCurrent = _accountCurrent;
          var accountOpen = _accountOpen;
          accountAddAction.tapClose();

          API.putAccount(accountCurrent).then(function() {
            var index = _accounts.indexOf(accountOpen);
            _accounts[index] = accountCurrent;
          });
        } else {
          modalAction.show({
              actions: [
                { textKey: 'ok' },
              ],
              title: isAccountValide.message,
            });
        }
      });

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

    case 'TAP_ADD_EXPENSE':
      _accountCurrent = {
          name: '',
          members: [{
            id: '0',
            name: null,
            email: null,
            photo: null,
            balances: [],
          }],
          expenses: [],
          share: false,
          couchDBDatabaseName: null,
        };
      break;

    case 'EXPENSE_CHANGE_RELATED_ACCOUNT':
      _accountCurrent = action.relatedAccount;
      break;
  }
});

module.exports = store;
