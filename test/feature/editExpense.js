'use strict';

var assert = require('assert');
var selector = require('./selector');
var fixture = require('../fixture');

describe('edit expense', function() {
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
    .click(selector.appBar + ' button') // Close
    .getText(selector.list + ' div:nth-child(3) div:nth-child(2)', function(err, text) {
      assert.equal(text, '5,00 €');
    })
    .call(done);
  });

  it('should update balance when we edit paidFor', function(done) {
    browser
    .click(selector.list)
    .click(selector.list)
    .click(selector.paidFor + ' ' + selector.list + ':nth-child(2)')
    .click(selector.expenseSave)
    .pause(200)
    .click(selector.appBar + ' button') // Close
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
    .click(selector.appBar + ' button') // Close
    .getText(selector.list + ' div:nth-child(3) div:nth-child(2)', function(err, text) {
      assert.equal(text, '10,00 $US');
    })
    .call(done);
  });

});
