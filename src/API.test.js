'use strict';

var path = require('path');
require('app-module-path').addPath(path.join(__dirname, ''));

var assert = require('chai').assert;
var fixture = require('../test/fixture');
var API = require('API');

describe('API', function() {
  // runs before all tests in this block
  before(function(done) {
    API.destroyAll().then(function() {
      done();
    });
  });

  describe('#putAccount()', function() {
    it('should store correctly when we call give an account with expenses', function(done) {
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
    it('should return the account when we give the id of a member', function(done) {
      API.fetchAccountsByMemberId('10').then(function(accounts) {
        assert.equal(accounts[0].name, 'AccountName');
        done();
      });
    });
  });

  describe('#putExpense()', function() {
    it('should store correctly when we give an expense with an account', function(done) {
      var expense = fixture.getExpense({
        contactIds: ['10'],
      });
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

  describe('#fetchExpensesOfAccount()', function() {
    it('should fetch the expenses of the account correctly when give an account', function(done) {
      var account = fixture.getAccount([{
        name: 'AccountName',
        id: '10'
      }]);
      var expense = fixture.getExpense({
        contactIds: ['10'],
      });

      account.expenses = [expense];
      expense.account = account;

      API.putAccount(account).then(function() {
        API.putExpense(expense).then(function() {
          API.fetchAccount(account._id).then(function(accountFetched) {
            API.fetchExpensesOfAccount(accountFetched).then(function() {
              assert.lengthOf(accountFetched.expenses, 1);
              assert.isObject(accountFetched.expenses[0]);
              done();
            });
          });
        });
      });
    });
  });
});
