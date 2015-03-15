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
      if (typeof account !== 'number') {
        promises.push(self.putAccount(account));
      }

      accountsId.push(account._id);
    });

    expense.accounts = accountsId;

    console.log('expense', expense);

    promises.push(expenseDB.put(expense));

    return new Lie.all(promises);
  },

  putAccount: function(account) {
    account._id = account.name;

    console.log('account', account);

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
};
