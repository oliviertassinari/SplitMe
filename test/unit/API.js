'use strict';

var assert = require('chai').assert;
var fixture = require('../fixture');
var API = require('../../src/API');

describe('API', function() {
  // runs before all tests in this block
  before(function(done) {
    API.destroyAll().then(function() {
      done();
    });
  });

  describe('#putAccount()', function() {
    it('should store correctly when we call putAccount', function(done) {
      var account = fixture.getAccount('AccountName', '10');
      account.expenses = [
        {
          _id: 'id1',
          amount: 13,
          // And more
        },
        'id2'
      ];

      API.putAccount(account).then(function() {
        API.fetchAccount(account._id).then(function(accountFetched) {
          var expenses = accountFetched.expenses;

          assert.lengthOf(expenses, 2);
          assert.equal(expenses[0], 'id1');
          assert.equal(expenses[1], 'id2');
          done();
        });
      });
    });
  });

  describe('#fetchAccountsByMemberId()', function() {
    it('should return the account when we request it', function(done) {
      API.fetchAccountsByMemberId('10').then(function(accounts) {
        assert.equal(accounts[0].name, 'AccountName');
        done();
      });
    });
  });

  describe('#putAccountsOfExpense()', function() {
    it('should store correctly when we call putAccountsOfExpense', function(done) {
      var account1 = fixture.getAccount('AccountName1', '10');
      var expense = fixture.getExpense('10');
      expense.accounts = [account1];
      account1.expenses = [expense];

      API.putAccountsOfExpense(expense).then(function() {
        API.fetchAccount(account1._id).then(function(account) {
          assert.equal(account.name, 'AccountName1');
          assert.lengthOf(account.expenses, 1);
          done();
        });
      });
    });
  });

  describe('#putExpense()', function() {
    it('should store correctly when we call putExpense', function(done) {
      var expense = fixture.getExpense('10');
      expense.accounts = [
        {
          _id: 'id1',
          name: 'tutu',
          // And so one
        },
        'id2'
      ];

      API.putExpense(expense).then(function() {
        API.fetchExpense(expense._id).then(function(expenseFetched) {
          var accounts = expenseFetched.accounts;

          assert.lengthOf(accounts, 2);
          assert.equal(accounts[0], 'id1');
          assert.equal(accounts[1], 'id2');
          done();
        });
      });
    });
  });
});
