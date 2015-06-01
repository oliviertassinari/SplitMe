'use strict';

var assert = require('assert');
var selector = require('./selector');
var fixture = require('../fixture');

describe('detail account', function() {
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

  it('should show the balance chart well sorted when we navigate to balance', function(done) {
    browser
    .waitFor(selector.list)
    .click(selector.list)
    .click(selector.appBarTab + ' div:nth-child(2)')
    .getText(selector.accountBalanceChart + ' div:nth-child(2)', function(err, text) {
      assert.equal(text, '6,66 €');
    })
    .getText(selector.accountBalanceChart + ' div:nth-child(3)', function(err, text) {
      assert.equal(text, '-6,66 €');
    })
    .call(done);
  });

  it('should show the go amount to be transfer when we navigate to debts', function(done) {
    browser
    .click(selector.appBarTab + ' div:nth-child(3)')
    .getText(selector.accountTransfer + ' div:nth-child(2)', function(err, text) {
      assert.equal(text, '6,66 €');
    })
    .call(done);
  });

  it('should show home when we navigate back', function(done) {
    browser
    .keys('Left arrow')
    .isExisting(selector.appBarTab, function(err, isExisting) {
      assert.equal(false, isExisting);
    })
    .call(done);
  });
});
