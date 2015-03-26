'use strict';

var assert = require('assert');
var API = require('../../src/API.jsx');
var utils = require('../../src/utils.jsx');

describe('API', function() {
  describe('#putAccount()', function() {
    it('should store correctly when we call putAccount', function(done) {
      var account = {
        name: 'C',
        dateLastExpense: null,
        expenses: [
          {
            _id: 'id1'
          },
          'id2'
        ],
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

      API.destroyAll().then(function() {
        API.putAccount(account).then(function() {
          API.fetchAccount(account._id).then(function(account) {
            assert.equal(2, account.expenses.length);
            assert.equal('id1', account.expenses[0]);
            assert.equal('id2', account.expenses[1]);
            done();
          });
        });
      });
    });
  });

  describe('#fetchAccountsByMemberId()', function() {
    it('should return the account when we request it', function(done) {
      API.fetchAccountsByMemberId('10').then(function(accounts) {
        assert.equal('C', accounts[0].name);
        done();
      });
    });
  });

  describe('#putExpense()', function() {
    var account = {
      name: 'A',
      dateLastExpense: null,
      expenses: [],
      members: [{
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

    it('should store correctly when we call putExpense', function(done) {
      var expense = {
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
        accounts: [account],
      };

      utils.applyExpenseToAccounts(expense);

      API.putExpense(expense).then(function() {

        API.fetchAccount(expense.accounts[0]._id).then(function(account) {
          assert.equal(1, account.expenses.length);
          done();
        });
      });
    });

    it('should store correctly when we call putExpense a second time', function(done) {
      var expense = {
        amount: 10,
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
        accounts: [account],
      };

      utils.applyExpenseToAccounts(expense);
        API.putExpense(expense).then(function() {
          API.fetchAccount(expense.accounts[0]._id).then(function(account) {
            assert.equal(2, account.expenses.length);
            done();
          });
        });
    });
  });
});
