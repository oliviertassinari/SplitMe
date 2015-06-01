'use strict';

var assert = require('assert');
var selector = require('./selector');
var fixture = require('../fixture');

describe('edit expense', function() {
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

  it('should update balance when we edit the amount of an expense', function(done) {
    browser
    .waitFor(selector.list)
    .click(selector.list)
    .waitFor(selector.list)
    .click(selector.list)
    .setValue(selector.expenseAddDescription, 'descriptionEdit')
    .setValue(selector.expenseAddAmount, 10)
    .click(selector.expenseSave)
    .pause(400) // Wait update
    .getText(selector.list + ' span', function(err, text) {
      assert.equal(text, 'descriptionEdit');
    })
    .getText(selector.list + ' div:nth-child(3)', function(err, text) {
      assert.equal(text, '10,00 €');
    })
    .click(selector.appBarLeftButton) // Close
    .getText(selector.list + ' div:nth-child(3) div:nth-child(2)', function(err, text) {
      assert.equal(text, '5,00 €');
    })
    .call(done);
  });

  it('should update balance when we edit paidFor', function(done) {
    browser
    .click(selector.list)
    .click(selector.list)
    .click(selector.expenseAddPaidFor + ' ' + selector.list + ':nth-child(2)')
    .click(selector.expenseSave)
    .pause(200)
    .click(selector.appBarLeftButton) // Close
    .pause(200)
    .getText(selector.list + ' div:nth-child(3) div:nth-child(2)', function(err, text) {
      assert.equal(text, '10,00 €');
    })
    .call(done);
  });

  it('should update balance when we edit currency', function(done) {
    browser
    .click(selector.list)
    .click(selector.list)
    .click(selector.expenseAddCurrency)
    .waitFor(selector.expenseAddCurrency + ' div:nth-child(2)')
    .click(selector.expenseAddCurrency + ' div:nth-child(2) div:nth-child(2)')
    .click(selector.expenseSave)
    .pause(400) // Wait update
    .getText(selector.list + ' div:nth-child(3)', function(err, text) {
      assert.equal(text, '10,00 $US');
    })
    .click(selector.appBarLeftButton) // Close
    .getText(selector.list + ' div:nth-child(3) div:nth-child(2)', function(err, text) {
      assert.equal(text, '10,00 $US');
    })
    .call(done);
  });

});
