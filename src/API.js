import PouchDB from 'pouchdb';
import moment from 'moment';
import Immutable from 'immutable';
import replicationStream from 'pouchdb-replication-stream';
import MemoryStream from 'memorystream';

PouchDB.plugin(replicationStream.plugin);
PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);

const pouchdbOption = {};

if (process.env.NODE_ENV === 'test') {
  pouchdbOption.db = require('memdown');
}

let db = new PouchDB('db', pouchdbOption);

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

    return db.dump(stream).then(() => {
      return dumpedString;
    });
  },
  import(string) {
    const stream = new MemoryStream();
    stream.end(string);

    return db.load(stream);
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

    return db.put(ddoc)
      .catch((err) => {
        if (err.status !== POUCHDB_CONFLICT) {
          throw err;
        }
      });
  },
  destroyAll() {
    return db.destroy().then(() => {
      db = new PouchDB('db', pouchdbOption);
      API.setUpDataBase();
    });
  },
  expenseAddPrefixId(string) {
    return 'expense_1_' + string;
  },
  expenseRemovePrefixId(string) {
    return string.substring(10);
  },
  putExpense(expense) {
    if (!expense.get('_id')) {
      expense = expense.set('_id', this.expenseAddPrefixId(moment().valueOf().toString()));
    }

    return db.put(expense.toJS())
      .then((response) => {
        return expense.set('_rev', response.rev);
      });
  },
  removeExpense(expense) {
    if (!(expense instanceof Immutable.Map)) {
      console.warn('expense have to be an instanceof Immutable.Map');
    }

    return db.remove(expense.toJS());
  },
  accountAddPrefixId(string) {
    return 'account_1_' + string;
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
        console.warn('expense missing id');
      }
    });

    const accountToStore = account.toJS();
    accountToStore.expenses = expenses;

    return db.put(accountToStore)
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
      return promise.then(() => {
        return db.remove(account.toJS());
      });
    } else {
      return db.remove(account.toJS());
    }
  },
  fetchAccountAll() {
    return db.allDocs({
      include_docs: true,
      startkey: 'account_1_',
      endkey: 'account_2_',
    }).then(handleResult);
  },
  fetch(id) {
    return db.get(id).then((result) => {
      return Immutable.fromJS(result);
    });
  },
  // No used
  fetchAccountsByMemberId(id) {
    return db.query('by_member_id', {
      key: id,
      include_docs: true,
    }).then(handleResult);
  },
  isExpensesFetched(expenses) {
    if (expenses.size > 0 && typeof expenses.get(0) === 'string') {
      return false;
    } else {
      return true;
    }
  },
  fetchExpensesOfAccount(account) {
    return db.allDocs({
      include_docs: true,
      keys: account.get('expenses').toJS(),
    }).then((result) => {
      return account.set('expenses', handleResult(result));
    });
  },
};

export default API;
