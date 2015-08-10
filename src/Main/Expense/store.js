'use strict';

var Immutable = require('immutable');
var _ = require('underscore');
var moment = require('moment');
var EventEmitter = require('events').EventEmitter;

var API = require('API');
var utils = require('utils');
var dispatcher = require('Main/dispatcher');
var modalAction = require('Main/Modal/action');
var accountAction = require('Main/Account/action');
var accountStore = require('Main/Account/store');

var _expenseOpened = null;
var _expenseCurrent = null;

function getPaidForByMember(member) {
  return Immutable.fromJS({
    contactId: member.get('id'), // Reference to a member
    split_equaly: true,
    split_unequaly: null,
    split_shares: 1,
  });
}

function setPaidForFromAccount(expense, account) {
  function updatePaidFor(i, list) {
    return list.push(getPaidForByMember(account.getIn(['members', i])));
  }

  return expense.withMutations(function(expenseMutable) {
      expenseMutable.set('paidFor', new Immutable.List());

      for (var i = 0; i < account.get('members').size; i++) {
        expenseMutable.update('paidFor', updatePaidFor.bind(this, i));
      }
    });
}

var store = _.extend({}, EventEmitter.prototype, {
  getCurrent: function() {
    return _expenseCurrent;
  },
  getOpened: function() {
    return _expenseOpened;
  },
  isValide: function(expense) {
    if (!utils.isNumber(expense.get('amount'))) {
      return {
        status: false,
        message: 'expense_add_error.amount_empty',
      };
    }

    if (expense.get('paidByContactId') === null) {
      return {
        status: false,
        message: 'expense_add_error.paid_for_empty',
      };
    }

    if (utils.getTransfersDueToAnExpense(expense).length === 0) {
      return {
        status: false,
        message: 'expense_add_error.paid_by_empty',
      };
    }

    return {
      status: true,
    };
  },
  saveAccountAndExpenses: function(account, expenses) { // Used for the tests, close to save()
    var promise;
    var expensesAdded = [];

    function getPutExpensePromise(expense) {
      return API.putExpense(expense).then(function(expenseAdded) {
          expensesAdded.push(expenseAdded);
        });
    }

    expenses.forEach(function(expense) {
      if (promise) {
        promise = promise.then(function() {
            return getPutExpensePromise(expense);
          });
      } else {
        promise = getPutExpensePromise(expense);
      }
    });

    return promise.then(function() {
      expensesAdded.forEach(function(expense) {
        account = utils.addExpenseToAccount(expense, account);
      });

      return API.putAccount(account).then(function(accountAdded) {
        accountAction.fetchAll();
        return accountAdded;
      });
    });
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

/**
 * Register callback to handle all updates
 */
dispatcher.register(function(action) {
  switch(action.actionType) {
    case 'EXPENSE_CLOSE':
      _expenseOpened = null;
      _expenseCurrent = null;
      break;

    case 'EXPENSE_TAP_LIST':
      _expenseOpened = action.expense;
      _expenseCurrent = _expenseOpened;
      store.emitChange();
      break;

    case 'TAP_ADD_EXPENSE':
    case 'TAP_ADD_EXPENSE_FOR_ACCOUNT':
      _expenseOpened = null;
      _expenseCurrent = Immutable.fromJS({
        description: '',
        amount: null,
        currency: 'EUR',
        date: moment().format('YYYY-MM-DD'),
        paidByContactId: null,
        split: 'equaly',
        paidFor: null,
        account: null,
      });

      _expenseCurrent = setPaidForFromAccount(_expenseCurrent, accountStore.getCurrent());

      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_DESCRIPTION':
      _expenseCurrent = _expenseCurrent.set('description', action.description);
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_AMOUNT':
      _expenseCurrent = _expenseCurrent.set('amount', action.amount);
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_DATE':
      _expenseCurrent = _expenseCurrent.set('date', action.date);
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_RELATED_ACCOUNT':
      _expenseCurrent = setPaidForFromAccount(_expenseCurrent, accountStore.getCurrent());
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_PAID_BY':
      _expenseCurrent = _expenseCurrent.set('paidByContactId', action.paidByContactId);
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_CURRENCY':
      _expenseCurrent = _expenseCurrent.set('currency', action.currency);
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_SPLIT':
      _expenseCurrent = _expenseCurrent.set('split', action.split);
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_PAID_FOR':
      _expenseCurrent = _expenseCurrent.set('paidFor', action.paidFor);
      store.emitChange();
      break;

    case 'EXPENSE_PICK_CONTACT':
      var contact = action.contact;

      // Prevent the dispatch inside a dispatch
      setTimeout(function() {
        if (!utils.getAccountMember(accountStore.getCurrent(), contact.id)) {
          var photo = null;

          if (contact.photos) {
            photo = contact.photos[0].value;
          }

          var member = Immutable.fromJS({
            id: contact.id,
            name: contact.displayName,
            email: null,
            photo: photo,
            balances: [],
          });

          if(action.useAsPaidBy) {
            _expenseCurrent = _expenseCurrent.set('paidByContactId', member.get('id'));
          }

          accountAction.addMember(member);
          // account.members.push(member);
        } else {
            modalAction.show({
              actions: [
                { textKey: 'ok' },
              ],
              title: 'contact_add_error',
            });
        }
      });
      break;

    case 'EXPENSE_TAP_SAVE':
      var expenseOpened = _expenseOpened;
      var expenseCurrent = _expenseCurrent;

      var account = accountStore.getCurrent();

      API.putExpense(expenseCurrent)
        .then(function(expenseAdded) {
          if (expenseOpened) { // Already exist
            account = utils.removeExpenseOfAccount(expenseOpened, account);
          }

          account = utils.addExpenseToAccount(expenseAdded, account);

          return API.putAccount(account);
        })
        .then(function() {
          accountAction.fetchAll();
          store.emitChange();
        }).catch(function(error) {
          console.warn(error);
        });
      break;

    case 'MODAL_TAP_OK':
      switch(action.triggerName) {
        case 'deleteExpenseCurrent':
          var account = accountStore.getCurrent();

          API.removeExpense(_expenseCurrent)
            .then(function() {
              account = utils.removeExpenseOfAccount(_expenseCurrent, account);

              return API.putAccount(account);
            })
            .then(function() {
              accountAction.fetchAll();
              _expenseOpened = null;
              _expenseCurrent = null;
            }).catch(function(error) {
              console.warn(error);
            });
          break;

        case 'closeExpenseCurrent':
          _expenseOpened = null;
          _expenseCurrent = null;
          break;
      }
      break;

    case 'ACCOUNT_ADD_MEMBER':
      _expenseCurrent = _expenseCurrent.update('paidFor', function(list) {
        return list.push(getPaidForByMember(action.member));
      });
      store.emitChange();
      break;
  }
});

module.exports = store;
