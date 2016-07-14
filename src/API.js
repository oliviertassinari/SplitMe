/* globals emit */

import moment from 'moment';
import Immutable from 'immutable';
import replicationStream from 'pouchdb-replication-stream';
import MemoryStream from 'memorystream';
import warning from 'warning';

const pouchdbOptions = {};

if (process.env.NODE_ENV === 'test') {
  pouchdbOptions.db = require('memdown');
}


let PouchDB;
let dbLocal;

function initPouchDB(options) {
  PouchDB = require('pouchdb');
  PouchDB.plugin(replicationStream.plugin);
  PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);

  return new PouchDB('db', options);
}

function getDb() {
  return new Promise((resolve) => {
    /**
     * We should avoid using this cordova-plugin-sqlite-2 on Android.
     * It works, but IndexedDB and WebSQL are better supported and faster
     * on that platform.
     */
    if (process.env.PLATFORM === 'ios') {
      pouchdbOptions.adapter = 'websql';

      document.addEventListener('deviceready', () => {
        // We need `window.cordova` to be available for PouchDB to work correctly.
        dbLocal = initPouchDB(pouchdbOptions);
        resolve(dbLocal);
      }, false);
    } else {
      dbLocal = initPouchDB(pouchdbOptions);
      resolve(dbLocal);
    }
  });
}

function setDb(dbNew) {
  dbLocal = dbNew;
}

function handleResult(result) {
  return Immutable.fromJS(result.rows.map((row) => {
    return row.doc;
  }));
}

const API = {
  export() {
    let dumpedString = '';

    const stream = new MemoryStream();
    stream.on('data', (chunk) => {
      dumpedString += chunk.toString();
    });

    return getDb()
      .then((db) => {
        return db.dump(stream);
      })
      .then(() => {
        return dumpedString;
      });
  },
  import(string) {
    const stream = new MemoryStream();
    stream.end(string);

    return getDb()
      .then((db) => {
        return db.load(stream);
      });
  },
  setUpDataBase() {
    const ddoc = {
      _id: '_design/by_member_id',
      views: {
        by_member_id: {
          map: function(doc) {
            const idToMatch = 'account';
            if (doc._id.substring(0, idToMatch.length) === idToMatch) {
              emit(doc.members[1].id);
            }
          }.toString(),
        },
      },
    };

    const POUCHDB_CONFLICT = 409;

    return getDb()
      .then((db) => {
        return db.put(ddoc);
      })
      .catch((err) => {
        if (err.status !== POUCHDB_CONFLICT) {
          throw err;
        }
      });
  },
  destroyAll() {
    return getDb()
      .then((db) => {
        return db.destroy();
      })
      .then(() => {
        setDb(new PouchDB('db', pouchdbOptions));
        API.setUpDataBase();
      });
  },
  expenseAddPrefixId(string) {
    return `expense_1_${string}`;
  },
  expenseRemovePrefixId(string) {
    return string.substring(10);
  },
  putExpense(expense) {
    if (!expense.get('_id')) {
      expense = expense.set('_id', this.expenseAddPrefixId(moment().valueOf().toString()));
    }

    return getDb()
      .then((db) => {
        return db.put(expense.toJS());
      })
      .then((response) => {
        return expense.set('_rev', response.rev);
      });
  },
  removeExpense(expense) {
    warning(
      expense instanceof Immutable.Map,
      'expense have to be an instanceof Immutable.Map'
    );

    return getDb()
      .then((db) => {
        return db.remove(expense.toJS());
      });
  },
  accountAddPrefixId(string) {
    warning(!string.startsWith('account_1'), 'accountAddPrefixId is called twice.');

    return `account_1_${string}`;
  },
  accountRemovePrefixId(string) {
    return string.substring(10);
  },
  putAccount(account) {
    if (!account.get('_id')) {
      account = account.set('_id', this.accountAddPrefixId(moment().valueOf().toString()));
    }

    const expenses = [];

    // Expenses of account need an id.
    account.get('expenses').forEach((expense) => {
      if (typeof expense === 'string') {
        expenses.push(expense);
      } else if (expense.get('_id')) {
        expenses.push(expense.get('_id'));
      } else {
        warning(false, 'expense missing id');
      }
    });

    const accountToStore = account.toJS();
    accountToStore.expenses = expenses;

    return getDb()
      .then((db) => {
        return db.put(accountToStore);
      })
      .then((response) => {
        return account.set('_rev', response.rev);
      });
  },
  removeAccount(account) {
    let promise;

    account.get('expenses').forEach((expense) => {
      if (promise) {
        promise = promise.then(() => {
          return API.removeExpense(expense);
        });
      } else {
        promise = API.removeExpense(expense);
      }
    });

    if (promise) {
      return promise
        .then(() => {
          return getDb();
        })
        .then((db) => {
          return db.remove(account.toJS());
        });
    } else {
      return getDb()
        .then((db) => {
          return db.remove(account.toJS());
        });
    }
  },
  fetchAccountAll() {
    return getDb()
      .then((db) => {
        return db.allDocs({
          include_docs: true,
          startkey: 'account_1_',
          endkey: 'account_2_',
        });
      })
      .then(handleResult);
  },
  fetch(id) {
    return getDb()
      .then((db) => {
        return db.get(id);
      })
      .then((result) => {
        return Immutable.fromJS(result);
      });
  },
  // No used
  fetchAccountsByMemberId(id) {
    return getDb()
      .then((db) => {
        return db.query('by_member_id', {
          key: id,
          include_docs: true,
        });
      })
      .then(handleResult);
  },
  isExpensesFetched(expenses) {
    return expenses.every((expense) => typeof expense === 'object');
  },
  fetchExpensesOfAccount(account) {
    const keys = account.get('expenses')
      .filter((expense) => typeof expense === 'string')
      .toJS();

    const fetchedExpenses = account.get('expenses')
      .filter((expense) => typeof expense !== 'string');

    return getDb()
      .then((db) => {
        return db.allDocs({
          include_docs: true,
          keys: keys,
        });
      })
      .then((result) => {
        return account.set('expenses', handleResult(result).concat(fetchedExpenses));
      });
  },
};

export default API;
