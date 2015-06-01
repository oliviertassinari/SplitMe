'use strict';

var assert = require('assert');
var selector = require('./selector');
var fixture = require('../fixture');

describe('delete expense', function() {
  before(function(done) {
    var expense = fixture.getExpense('10');
    expense.accounts = [
      fixture.getAccount('AccountName1', '10')
    ];

    browser
    .url('http://0.0.0.0:8000')
    .executeAsync(fixture.executeAsyncSaveExpense, expense, function(err) { // node.js context
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
    .getText(selector.appBarTitle, function(err, text) {
      assert.equal(text, 'AccountName1');
    })
    .pause(500)
    .elements(selector.list, function(err, res) {
      assert.equal(0, res.value.length);
    })
    .call(done);
  });
});
