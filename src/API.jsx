'use strict';

var PouchDB = require('pouchdb');
var moment = require('moment');
var _ = require('underscore');
var Lie = require('lie');

var expenseDB = new PouchDB('expense');
var accountDB = new PouchDB('account');

new PouchDB('expense').destroy().then(function() {
  expenseDB = new PouchDB('expense');
});

new PouchDB('account').destroy().then(function() {
  accountDB = new PouchDB('account');
});

module.exports = {
  putExpense: function(expense) {
    var promises = [];

    expense._id = moment().format();

    var self = this;
    var accountsId = [];

    _.each(expense.accounts, function(account) {
      account.expenses.push(expense._id);

      if (typeof account !== 'number') {
        promises.push(self.putAccount(account));
      }

      accountsId.push(account._id);
    });

    expense.accounts = accountsId;

    promises.push(expenseDB.put(expense));

    return new Lie.all(promises);
  },
  putAccount: function(account) {
    account._id = account.name;

    return accountDB.put(account);
  },
  fetchAccountAll: function() {
    return accountDB.allDocs({
      include_docs: true
    }).then(function (result) {
      var rows = _.map(result.rows, function(row) {
        return row.doc;
      });

      return rows;
    }).catch(function (err) {
      console.log(err);
    });
  },
  fetchAccount: function(accountId) {
    return accountDB.get(accountId);
  },
  isExpensesFetched: function(expenses) {
    if(expenses.length > 0 && typeof expenses[0] === 'string') {
      return false;
    } else {
      return true;
    }
  },
  fetchExpensesOfAccount: function(account) {
    var expenses = account.expenses;

    // Load
    if(!this.isExpensesFetched(expenses)) {
      return expenseDB.allDocs({
        include_docs: true,
        keys: expenses,
      }).then(function(result) {
        account.expenses = _.map(result.rows, function(row) {
          return row.doc;
        });

        return true; // firstFetched
      });
    } else {
      return new Lie(function(resolve) {
        resolve(false); // firstFetched
      });
    }
  },
  fetchAccountsNext: function(account) {
    var accountsHash = {};
    var accountToFetch = [];

    // Fetch
    for(var i = 0; i < account.expenses.length; i++) {
      var expense = account.expenses[i];

      for(var j = 0; j < expense.accounts.length; j++) {
        var accountExpense = expense.accounts[j];

        if(typeof accountExpense === 'string' && !accountsHash[accountExpense]) {
          accountToFetch.push(accountExpense);
          accountsHash[accountExpense] = true;
        }
      }
    }

    if(accountToFetch.length > 0) {
      return accountDB.allDocs({
        include_docs: true,
        keys: accountToFetch,
      }).then(function(result) {
        _.each(result.rows, function(row) {
          accountsHash[row.doc._id] = row.doc;
        });

        for(var i = 0; i < account.expenses.length; i++) {
          var expense = account.expenses[i];

          for(var j = 0; j < expense.accounts.length; j++) {
            expense.accounts[j] = accountsHash[expense.accounts[j]];
          }
        }

        return true; // New data
      });
    } else {
      return new Lie(function(resolve) {
        resolve(false); // No new data
      });
    }
  },
};
