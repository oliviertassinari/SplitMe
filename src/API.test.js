'use strict';

const path = require('path');
require('app-module-path').addPath(path.join(__dirname, ''));

const Immutable = require('immutable');
const assert = require('chai').assert;
const fixture = require('../test/fixture');
const API = require('API');

describe('API', function() {
  // runs before all tests in this block
  before(function(done) {
    API.destroyAll().then(function() {
      done();
    }).catch(function(err) {
      console.log(err);
    });
  });

  describe('#putAccount()', function() {
    it('should store correctly when we call give an account with expenses', function(done) {
      let account = fixture.getAccount([{
        name: 'AccountName',
        id: '10',
      }]);
      account = account.set('expenses', Immutable.fromJS([
        {
          _id: 'id1',
          amount: 13,
          // And more
        },
        'id2',
      ]));

      API.putAccount(account)
        .then(function(accountAdded) {
          return API.fetch(accountAdded.get('_id'));
        })
        .then(function(accountFetched) {
          const expenses = accountFetched.get('expenses');

          assert.equal(expenses.size, 2);
          assert.equal(expenses.get(0), 'id1');
          assert.equal(expenses.get(1), 'id2');
          done();
        });
    });
  });

  describe('#fetchAccountsByMemberId()', function() {
    it('should return the account when we give the id of a member', function(done) {
      API.fetchAccountsByMemberId('10').then(function(accounts) {
        assert.equal(accounts.getIn([0, 'name']), 'AccountName');
        done();
      });
    });
  });

  describe('#putExpense()', function() {
    it('should store correctly when we give an expense', function(done) {
      const expense = fixture.getExpense({
        paidForContactIds: ['10'],
      });

      API.putExpense(expense)
        .then(function(expenseAdded) {
          return API.fetch(expenseAdded.get('_id'));
        })
        .then(function(expenseFetched) {
          assert.equal(expenseFetched.getIn(['paidFor', 1, 'contactId']), '10');
          done();
        });
    });
  });

  describe('#fetchExpensesOfAccount()', function() {
    it('should fetch the expenses of the account correctly when give an account', function(done) {
      let account = fixture.getAccount([{
        name: 'AccountName',
        id: '10',
      }]);

      const expense = fixture.getExpense({
        paidForContactIds: ['10'],
      });

      API.putExpense(expense)
        .then(function(expenseAdded) {
          account = account.set('expenses', [expenseAdded]);
          return API.putAccount(account);
        })
        .then(function(accountAdded) {
          return API.fetch(accountAdded.get('_id'));
        })
        .then(function(accountFetched) {
          return API.fetchExpensesOfAccount(accountFetched)
            .then(function(accountWithExpenses) {
              assert.equal(accountWithExpenses.get('expenses').size, 1);
              assert.isObject(accountWithExpenses.getIn(['expenses', 0]).toJS());
              done();
            });
        });
    });
  });

  describe('#removeAccount()', function() {
    it('should not see the account when we remove it', function(done) {
      API.fetchAccountAll()
        .then(function(accounts) {
          assert.equal(accounts.size, 2);

          return API.fetchExpensesOfAccount(accounts.get(1));
        })
        .then(function(accountWithExpenses) {
          return API.removeAccount(accountWithExpenses);
        })
        .then(function() {
          return API.fetchAccountAll();
        })
        .then(function(accounts) {
          assert.equal(accounts.size, 1);
          done();
        });
    });
  });
});
