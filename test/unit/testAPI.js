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
      var account = fixture.getAccount([{
        name: 'AccountName',
        id: '10'
      }]);
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

  describe('#putExpense()', function() {
    it('should store correctly when we call putExpense', function(done) {
      var expense = fixture.getExpense('10');
      expense.account = {
        _id: 'id1',
        name: 'tutu',
        // And so one
      };

      API.putExpense(expense).then(function() {
        API.fetchExpense(expense._id).then(function(expenseFetched) {
          assert.equal(expenseFetched.account, 'id1');
          done();
        });
      });
    });
  });
});
