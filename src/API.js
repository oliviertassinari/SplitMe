'use strict';

const PouchDB = require('pouchdb');
const moment = require('moment');
const _ = require('underscore');
const Immutable = require('immutable');
const replicationStream = require('pouchdb-replication-stream');
const MemoryStream = require('memorystream');

PouchDB.plugin(replicationStream.plugin);
PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);

const pouchdbOption = {};

if (process.env.NODE_ENV === 'test') {
  pouchdbOption.db = require('memdown');
}

let db = new PouchDB('db', pouchdbOption);

function handleResult(result) {
  return Immutable.fromJS(_.map(result.rows, function(row) {
    return row.doc;
  }));
}

const API = {
  export: function() {
    let dumpedString = '';

    const stream = new MemoryStream();
    stream.on('data', function(chunk) {
      dumpedString += chunk.toString();
    });

    return db.dump(stream).then(function() {
      return dumpedString;
    });
  },
  import: function(string) {
    const stream = new MemoryStream();
    stream.end(string);

    return db.load(stream);
  },
  setUpDataBase: function() {
    const ddoc = {
      _id: '_design/by_member_id',
      views: {
        by_member_id: {
          map: function(doc) {
            if (doc._id.substring(0, 7) === 'account') {
              emit(doc.members[1].id);
            }
          }.toString(),
        },
      },
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
      db = new PouchDB('db', pouchdbOption);
      API.setUpDataBase();
    });
  },
  putExpense: function(expense) {
    if (!expense.get('_id')) {
      expense = expense.set('_id', 'expense_1_' + moment().valueOf().toString());
    }

    return db.put(expense.toJS())
      .then(function(response) {
        return expense.set('_rev', response.rev);
      });
  },
  removeExpense: function(expense) {
    if (!(expense instanceof Immutable.Map)) {
      console.warn('expense have to be an instanceof Immutable.Map');
    }

    return db.remove(expense.toJS());
  },
  putAccount: function(account) {
    if (!account.get('_id')) {
      account = account.set('_id', 'account_1_' + moment().valueOf().toString());
    }

    const expenses = [];

    // Expenses of account need an id.
    account.get('expenses').forEach(function(expense) {
      if (typeof expense === 'string') {
        expenses.push(expense);
      } else if (expense.get('_id')) {
        expenses.push(expense.get('_id'));
      } else {
        console.warn('expense missing id');
      }
    });

    const accountToStore = account.toJS();
    accountToStore.expenses = expenses;

    return db.put(accountToStore)
      .then(function(response) {
        return account.set('_rev', response.rev);
      });
  },
  removeAccount: function(account) {
    let promise;

    account.get('expenses').forEach(function(expense) {
      if (promise) {
        promise = promise.then(function() {
          return API.removeExpense(expense);
        });
      } else {
        promise = API.removeExpense(expense);
      }
    });

    return promise.then(function() {
      return db.remove(account.toJS());
    });
  },
  fetchAccountAll: function() {
    return db.allDocs({
      include_docs: true,
      startkey: 'account_1_',
      endkey: 'account_2_',
    }).then(handleResult);
  },
  fetch: function(id) {
    return db.get(id).then(function(result) {
      return Immutable.fromJS(result);
    });
  },
  // No used
  fetchAccountsByMemberId: function(id) {
    return db.query('by_member_id', {
      key: id,
      include_docs: true,
    }).then(handleResult);
  },
  isExpensesFetched: function(expenses) {
    if (expenses.size > 0 && typeof expenses.get(0) === 'string') {
      return false;
    } else {
      return true;
    }
  },
  fetchExpensesOfAccount: function(account) {
    return db.allDocs({
      include_docs: true,
      keys: account.get('expenses').toJS(),
    }).then(function(result) {
      return account.set('expenses', handleResult(result));
    });
  },
};

module.exports = API;
