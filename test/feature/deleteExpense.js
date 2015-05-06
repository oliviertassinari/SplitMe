'use strict';

var assert = require('assert');
var fixture = require('../fixture');

var selectorModal = '#main > div > .mui-dialog';

describe('delete expense', function() {
  before(function(done) {
    var account = fixture.getAccount('AccountName1', '10');

    var expense = fixture.getExpense('10');
    expense.accounts = [account];

    browser
    .url('http://0.0.0.0:8000')
    .timeoutsAsyncScript(5000)
    .executeAsync(function(expense, done) { // browser context
      var API = window.tests.API;
      var expenseStore = window.tests.expenseStore;

      API.destroyAll().then(function() {
        expenseStore.save(null, expense).then(function() {
          done();
        });
      });
    }, expense, function(err) { // node.js context
      if(err) {
        throw(err);
      }
    })
    .call(done);
  });

  it('should show account when we delete an expense', function(done) {
    browser
    .waitFor('.mui-paper .list:nth-child(1)')
    .click('.mui-paper .list:nth-child(1)')
    .waitFor('.mui-paper .list:nth-child(1)')
    .click('.mui-paper .list:nth-child(1)')
    .click('.button-bottom button') // delete
    .waitFor('.mui-dialog-window-action')
    .click(selectorModal + ' .mui-dialog-window-action:nth-child(2)') // OK
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'AccountName1');
    })
    .pause(300)
    .elements('.mui-paper .list', function(err, res) {
      assert.equal(0, res.value.length);
    })
    .call(done);
  });
});
