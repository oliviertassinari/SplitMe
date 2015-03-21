'use strict';

var assert = require('assert');
var API = require('../../src/API.jsx');
var utils = require('../../src/utils.jsx');

describe('API', function() {
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
        date: '3/21/2015',
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

      API.destroyAll().then(function() {
        utils.applyExpenseToAccounts(expense);

        API.putExpense(expense).then(function() {

          API.fetchAccount(expense.accounts[0]._id).then(function(account) {
            assert.equal(1, account.expenses.length);
            done();
          });
        });
      });
    });

    it('should store correctly when we call putExpense a second time', function(done) {
      var expense = {
        amount: 10,
        currency: 'EUR',
        type: 'individual',
        date: '3/21/2015',
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
        setTimeout(function(){
          API.putExpense(expense).then(function() {
            API.fetchAccount(expense.accounts[0]._id).then(function(account) {
              assert.equal(2, account.expenses.length);
              done();
            });
          });
        }, 1000);
    });
  });
});
