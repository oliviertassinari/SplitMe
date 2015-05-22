'use strict';

var assert = require('assert');
var selector = require('./selector');
var fixture = require('../fixture');

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
    .waitFor(selector.list)
    .click(selector.list)
    .waitFor(selector.list)
    .elements(selector.list, function(err, res) {
      assert.equal(1, res.value.length);
    })
    .click(selector.list)
    .click(selector.bottomButton) // delete
    .waitFor(selector.modal)
    .click(selector.modal + ' button:nth-child(2)') // OK
    .getText(selector.appBar + ' h1', function(err, text) {
      assert.equal(text, 'AccountName1');
    })
    .pause(300)
    .elements(selector.list, function(err, res) {
      assert.equal(0, res.value.length);
    })
    .call(done);
  });
});
