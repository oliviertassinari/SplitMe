'use strict';

var assert = require('assert');
var API = require('../../src/API.jsx');

function getAccount(name) {
  return {
    name: name,
    dateLastExpense: null,
    members: [{ // Me always on 1st position
      id: '0',
      displayName: 'Me',
    },{
      id: '10',
      displayName: 'A',
    }],
    balances: [{
      value: 0,
      currency: 'EUR',
    }],
  };
}

function getExpense() {
  return {
    amount: 13.31,
    currency: 'EUR',
    type: 'individual',
    date: '2015-03-21',
    paidByContactId: '0',
    split: 'equaly',
    paidFor: [
      {
        contactId: '0',
        split_equaly: true,
      },
      {
        contactId: '10',
        split_equaly: true,
      },
    ],
  };
}

describe('API', function() {
  // runs before all tests in this block
  before(function(done) {
    API.destroyAll().then(function() {
      done();
    });
  });

  describe('#putAccount()', function() {
    it('should store correctly when we call putAccount', function(done) {
      var account = getAccount('AccountName');
      account.expenses = [
        {
          _id: 'id1',
          amount: 13,
          // And more
        },
        'id2'
      ];

      API.putAccount(account).then(function() {
        API.fetchAccount(account._id).then(function(account) {
          var expenses = account.expenses;

          assert.equal(2, expenses.length);
          assert.equal('id1', expenses[0]);
          assert.equal('id2', expenses[1]);
          done();
        });
      });
    });
  });

  describe('#fetchAccountsByMemberId()', function() {
    it('should return the account when we request it', function(done) {
      API.fetchAccountsByMemberId('10').then(function(accounts) {
        assert.equal('AccountName', accounts[0].name);
        done();
      });
    });
  });

  describe('#putAccountsOfExpense()', function() {
    it('should store correctly when we call putAccountsOfExpense', function(done) {
      var account1 = getAccount('AccountName1');
      var expense = getExpense();
      expense.accounts = [account1];
      account1.expenses = [expense];

      API.putAccountsOfExpense(expense).then(function() {
        API.fetchAccount(account1._id).then(function(account) {
          assert.equal('AccountName1', account.name);
          assert.equal(1, account.expenses.length);
          done();
        });
      });
    });
  });

  describe('#putExpense()', function() {
    it('should store correctly when we call putExpense', function(done) {
      var expense = getExpense();
      expense.accounts = [
        {
          _id: 'id1',
          name: 'tutu',
          // And so one
        },
        'id2'
      ];

      API.putExpense(expense).then(function() {
        API.fetchExpense(expense._id).then(function(expense) {
          var accounts = expense.accounts;

          assert.equal(2, accounts.length);
          assert.equal('id1', accounts[0]);
          assert.equal('id2', accounts[1]);
          done();
        });
      });
    });
  });
});
