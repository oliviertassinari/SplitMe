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

function getPaidForByMemberDefault(member) {
  return Immutable.fromJS({
    contactId: member.get('id'), // Reference to a member
    split_equaly: true,
    split_unequaly: null,
    split_shares: 1,
  });
}
function getPaidForByMemberNew(member) {
  return Immutable.fromJS({
    contactId: member.get('id'), // Reference to a member
    split_equaly: false,
    split_unequaly: null,
    split_shares: 0,
  });
}

function setPaidForFromAccount(expense, account) {
  var paidFor = new Immutable.List();

  paidFor = paidFor.withMutations(function(paidForMutable) {
    account.get('members').forEach(function(member) {
      paidForMutable.push(getPaidForByMemberDefault(member));
    })
  });

  return expense.set('paidFor', paidFor);
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
  var account;
  var expenseCurrent;

  switch (action.actionType) {
    case 'EXPENSE_CLOSE':
      _expenseOpened = null;
      _expenseCurrent = null;
      break;

    case 'EXPENSE_TAP_LIST':
      var account = accountStore.getCurrent();
      var expense = action.expense;

      // Need to match, should be often
      if (account.get('members').size !== expense.get('paidFor').size) {
        expense = expense.withMutations(function(expenseMutable) {
          account.get('members').forEach(function(member) {
            var found = expense.get('paidFor').find(function(item) {
              return item.get('contactId') === member.get('id');
            });

            if (!found) {
              expenseMutable.update('paidFor', function(list) {
                return list.push(getPaidForByMemberNew(member));
              });
            }
          });
        });
      }

      _expenseOpened = expense;
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

        if (action.useAsPaidBy) {
          _expenseCurrent = _expenseCurrent.set('paidByContactId', member.get('id'));
        }

        accountStore.updateAccountCurrentMember(member);
        _expenseCurrent = _expenseCurrent.update('paidFor', function(list) {
          return list.push(getPaidForByMemberDefault(member));
        });
        store.emitChange();
      } else {
        // Prevent the dispatch inside a dispatch
        setTimeout(function() {
            modalAction.show({
              actions: [
                { textKey: 'ok' },
              ],
              title: 'contact_add_error',
            });
          });
      }
      break;

    case 'EXPENSE_TAP_SAVE':
      var expenseOpened = _expenseOpened;
      expenseCurrent = _expenseCurrent;

      _expenseOpened = null;
      _expenseCurrent = null;

      API.putExpense(expenseCurrent)
        .then(function(expenseAdded) {
          // If the user have the time to move to another account, it breaks
          account = accountStore.getCurrent();

          if (expenseOpened) { // Already exist
            account = utils.removeExpenseOfAccount(expenseOpened, account);
          }

          account = utils.addExpenseToAccount(expenseAdded, account);

          var promise = accountStore.replaceAccount(account, accountStore.getOpened());
          accountStore.setOpened(null);

          return promise;
        })
        .then(function(accountNew) {
          accountStore.setCurrent(accountNew);
          store.emitChange();
        });
      break;

    case 'MODAL_TAP_OK':
      switch (action.triggerName) {
        case 'deleteExpenseCurrent':
          // If the user have the time to move to another account, it breaks
          expenseCurrent = _expenseCurrent;

          _expenseOpened = null;
          _expenseCurrent = null;

          account = accountStore.getCurrent();
          account = utils.removeExpenseOfAccount(expenseCurrent, account);
          accountStore.setCurrent(account);
          store.emitChange();

          API.removeExpense(expenseCurrent)
            .then(function() {
              var promise = accountStore.replaceAccount(account, accountStore.getOpened());
              accountStore.setOpened(null);

              return promise;
            })
            .then(function(accountNew) {
              accountStore.setCurrent(accountNew);
              store.emitChange();
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
