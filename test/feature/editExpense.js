'use strict';

var assert = require('assert');
var fixture = require('../fixture');

var selectorClose = '.mui-app-bar-navigation-icon-button';

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
    }, expense, function(err, ret) { // node.js context
      if(err) {
        throw(err);
      }
    })
    .call(done);
  });

  it('should update balance when we edit the amount of an expense', function(done) {
    browser
    .waitFor('.mui-paper:nth-child(1) .list', 1000)
    .click('.mui-paper:nth-child(1) .list')
    .waitFor('.mui-paper:nth-child(1) .list', 1000)
    .click('.mui-paper:nth-child(1) .list')
    .setValue('.expense-detail > .mui-text-field input', 'descriptionEdit')
    .setValue('.expense-detail-item:nth-child(2) input', 10)
    .click('.expense-save')
    .pause(400) // Wait update
    .getText('.list:nth-child(1) .list-content span', function(err, text) {
      assert.equal(text, 'descriptionEdit');
    })
    .getText('.list:nth-child(1) .list-right', function(err, text) {
      assert.equal(text, '10 €');
    })
    .click(selectorClose)
    .getText('.list:nth-child(1) .mui-font-style-title', function(err, text) {
      assert.equal(text, '5 €');
    })
    .call(done);
  });

  it('should update balance when we edit paidFor', function(done) {
    browser
    .click('.mui-paper:nth-child(1) .list')
    .click('.mui-paper:nth-child(1) .list')
    .click('.expense-detail-item:nth-child(6) .list:nth-child(2)')
    .click('.expense-save')
    .click(selectorClose)
    .pause(200)
    .getText('.list:nth-child(1) .mui-font-style-title', function(err, text) {
      assert.equal(text, '10 €');
    })
    .call(done);
  });

  it('should update balance when we edit currency', function(done) {
    browser
    .click('.mui-paper:nth-child(1) .list')
    .click('.mui-paper:nth-child(1) .list')
    .click('.expense-detail-item:nth-child(2) .mui-drop-down-menu')
    .waitFor('.expense-detail-item:nth-child(2) .mui-drop-down-menu .mui-menu-item:nth-child(2)', 1000)
    .click('.expense-detail-item:nth-child(2) .mui-drop-down-menu .mui-menu-item:nth-child(2)')
    .click('.expense-save')
    .pause(400) // Wait update
    .getText('.list:nth-child(1) .list-right', function(err, text) {
      assert.equal(text, '10 $');
    })
    .click(selectorClose)
    .getText('.list:nth-child(1) .mui-font-style-title', function(err, text) {
      assert.equal(text, '10 $');
    })
    .call(done);
  });

});