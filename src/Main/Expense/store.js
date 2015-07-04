'use strict';

var _ = require('underscore');
var moment = require('moment');
var EventEmitter = require('events').EventEmitter;

var API = require('API');
var utils = require('utils');
var dispatcher = require('Main/dispatcher');
var modalAction = require('Main/Modal/action');
var accountAction = require('Main/Account/action');
var expenseAction = require('./action');

var _expenseOpened = null;
var _expenseCurrent = null;

function getPaidForByMember(member) {
  return {
    contactId: member.id, // Reference to a member
    split_equaly: true,
    split_unequaly: null,
    split_shares: 1,
  };
}

function setAccountOfExpense(expense, account) {
  expense.account = account;
  expense.paidFor = [];

  for (var i = 0; i < account.members.length; i++) {
    expense.paidFor.push(getPaidForByMember(account.members[i]));
  }
}

function save(oldExpense, expense) {
  if (oldExpense) { // Already exist
    utils.removeExpenseOfAccount(oldExpense);
  }

  utils.addExpenseToAccount(expense);

  // Auto generated account
  if (!expense.account._id) {
    expense.account.name = expense.account.members[1].displayName;
  }

  return API.putAccount(expense.account).then(function() {
    return API.putExpense(expense).then(function() {
      accountAction.fetchAll();
    });
  });
}

function remove(expense) {
  utils.removeExpenseOfAccount(expense);

  return API.putAccount(expense.account).then(function() {
    return API.removeExpense(expense).then(function() {
      accountAction.fetchAll();
    });
  });
}

function isValide(expense) {
  if (!utils.isNumber(expense.amount)) {
    return {
      status: false,
      message: 'expense_add_error.amount_empty',
    };
  }

  if (expense.paidByContactId === null) {
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
}

var store = _.extend({}, EventEmitter.prototype, {
  getCurrent: function() {
    return _expenseCurrent;
  },
  saveAccountAndExpenses: function(account, expenses) { // Used for the tests, close to save()
    var promise;

    expenses.forEach(function(expense) {
      expense.account = account;

      utils.addExpenseToAccount(expense);

      var promiseCurrent = API.putExpense(expense);

      if (promise) {
        promise.then(function() {
          return promiseCurrent;
        });
      } else {
        promise = promiseCurrent;
      }
    });

    return promise.then(function() {
      return API.putAccount(account).then(function() {
        accountAction.fetchAll();
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
  }
});

/**
 * Register callback to handle all updates
 */
dispatcher.register(function(action) {
  switch(action.actionType) {
    case 'EXPENSE_TAP_CLOSE':
      _expenseOpened = null;
      _expenseCurrent = null;
      break;

    case 'EXPENSE_TAP_LIST':
      _expenseOpened = action.expense;
      _expenseCurrent = _.clone(_expenseOpened);
      _expenseCurrent.paidFor = JSON.parse(JSON.stringify(_expenseOpened.paidFor));
      store.emitChange();
      break;

    case 'TAP_ADD_EXPENSE':
    case 'TAP_ADD_EXPENSE_FOR_ACCOUNT':
      if(!_expenseCurrent) {
        _expenseOpened = null;
        _expenseCurrent = {
          description: '',
          amount: null,
          currency: 'EUR',
          date: moment().format('YYYY-MM-DD'),
          paidByContactId: null,
          split: 'equaly',
          paidFor: null,
          account: null,
        };

        if (action.account) {
          setAccountOfExpense(_expenseCurrent, action.account);
        } else {
          setAccountOfExpense(_expenseCurrent, {
            members: [{
              id: '0',
              balances: [],
            }],
            expenses: [],
          });
        }

        store.emitChange();
      }
      break;

    case 'EXPENSE_CHANGE_DESCRIPTION':
      _expenseCurrent.description = action.description;
      break;

    case 'EXPENSE_CHANGE_AMOUNT':
      _expenseCurrent.amount = action.amount;
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_DATE':
      _expenseCurrent.date = action.date;
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_RELATED_ACCOUNT':
      setAccountOfExpense(_expenseCurrent, action.relatedAccount);
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_PAID_BY':
      _expenseCurrent.paidByContactId = action.paidByContactId;
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_CURRENCY':
      _expenseCurrent.currency = action.currency;
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_SPLIT':
      _expenseCurrent.split = action.split;
      store.emitChange();
      break;

    case 'EXPENSE_CHANGE_PAID_FOR':
      _expenseCurrent.paidFor = action.paidFor;
      store.emitChange();
      break;

    case 'EXPENSE_PICK_CONTACT':
      var contact = action.contact;
      var account = _expenseCurrent.account;

      if (!utils.getAccountMember(account, contact.id)) {
        var photo = null;

        if (contact.photos) {
          photo = contact.photos[0].value;
        }

        var member = {
          id: contact.id,
          displayName: contact.displayName,
          balances: [],
          photo: photo,
        };

        _expenseCurrent.paidFor.push(getPaidForByMember(member));
        account.members.push(member);

        store.emitChange();
      } else {
        // Prevent the dispatch inside a dispatch
        setTimeout(function() {
          modalAction.show({
            actions: [
              { textKey: 'ok' }
            ],
            title: 'contact_add_error',
          });
        });
      }
      break;

    case 'EXPENSE_TAP_SAVE':
      var isExpenseValide = isValide(_expenseCurrent);

      if (isExpenseValide.status) {
        save(_expenseOpened, _expenseCurrent).then(function() {
          expenseAction.tapClose();
        }).catch(function(error) {
          console.log(error);
        });
      } else {
        // Prevent the dispatch inside a dispatch
        setTimeout(function() {
          modalAction.show({
            actions: [
              { textKey: 'ok' }
            ],
            title: isExpenseValide.message,
          });
        });
      }
      break;

    case 'EXPENSE_NAVIGATE_BACK':
      var title;

      if (action.page === 'editExpense') {
        title = 'expense_confirm_delete_edit';
      } else {
        title = 'expense_confirm_delete';
      }

      // Prevent the dispatch inside a dispatch
      setTimeout(function() {
        modalAction.show({
          actions: [
            { textKey: 'delete', triggerOK: true, triggerName: 'closeExpenseCurrent' },
            { textKey: 'cancel' }
          ],
          title: title,
        });
      });
      break;

    case 'MODAL_TAP_OK':
      switch(action.triggerName) {
        case 'deleteExpenseCurrent':
          remove(_expenseCurrent).then(function() {
            _expenseOpened = null;
            _expenseCurrent = null;
          }).catch(function(error) {
            console.log(error);
          });
          break;

        case 'closeExpenseCurrent':
          _expenseOpened = null;
          _expenseCurrent = null;
          break;
      }

      break;
  }
});

module.exports = store;
