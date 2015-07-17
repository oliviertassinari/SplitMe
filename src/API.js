'use strict';

var PouchDB = require('pouchdb');
var moment = require('moment');
var _ = require('underscore');

var db = new PouchDB('db');

function handleResult(result) {
  return _.map(result.rows, function(row) {
    return row.doc;
  });
}

var API = {
  setUpDataBase: function() {
    var ddoc = {
      _id: '_design/by_member_id',
      views: {
        by_member_id: {
          map: function (doc) {
            if (doc.type === 'account') {
              emit(doc.members[1].id);
            }
          }.toString()
        }
      }
    };

    return db.put(ddoc)
      .catch(function(err) {
        if (err.status !== 409) { // Not a conflict
          throw err;
        }
      });
  },
  destroyAll: function() {
    return db.destroy().then(function() {
      db = new PouchDB('db');
      API.setUpDataBase();
    });
  },
  putExpense: function(expense) {
    if(!expense._id) {
      expense._id = 'expense_1_' + moment().valueOf().toString();
    }

    expense.type = 'expense';

    return db.put(expense).then(function(response) {
      expense._rev = response.rev;
    });
  },
  removeExpense: function(expense) {
    return db.remove(expense);
  },
  putAccount: function(account) {
    if(!account._id) {
      account._id = 'account_1_' + moment().valueOf().toString();
    }

    account.type = 'account';

    var accountToStore = _.clone(account);
    accountToStore.expenses = [];

    // Expenses of account need an id.
    _.each(account.expenses, function(expense) {
      var id;

      if (typeof expense === 'string') {
        id = expense;
      } else if(expense._id) {
        id = expense._id;
      } else {
        id = 'expense_1_' + moment().valueOf().toString();
        expense._id = id;
      }

      accountToStore.expenses.push(id);
    });

    return db.put(accountToStore).then(function(response) {
      account._rev = response.rev;
    });
  },
  fetchExpense: function(id) {
    return db.get(id);
  },
  fetchAccountAll: function() {
    return db.allDocs({
      include_docs: true,
      startkey: 'account_1_',
      endkey: 'account_2_',
    }).then(handleResult);
  },
  fetchAccount: function(id) {
    return db.get(id);
  },
  fetchAccountsByMemberId: function(id) { // No used
    return db.query('by_member_id', {
        key: id,
        include_docs: true,
      })
      .then(handleResult);
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

    return db.allDocs({
      include_docs: true,
      keys: expenses,
    }).then(function(result) {
      account.expenses = handleResult(result);
    });
  },
};

module.exports = API;
