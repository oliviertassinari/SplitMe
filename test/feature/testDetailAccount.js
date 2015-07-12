'use strict';

var assert = require('chai').assert;
var selector = require('./selector');
var fixture = require('../fixture');

describe('detail account', function() {
  before(function(done) {
    var account1 = fixture.getAccount([{
      name: 'AccountName1',
      id: '10'
    }]);
    var expenses1 = [
      fixture.getExpense({
        contactIds: ['10'],
      }),
    ];

    var account2 = fixture.getAccount([{
      name: 'AccountName2',
      id: '12'
    }]);
    var expenses2 = [
      fixture.getExpense({
        contactIds: ['12'],
      }),
      fixture.getExpense({
        contactIds: ['12'],
        currency: 'USD',
      }),
    ];

    browser
    .url('http://0.0.0.0:8000')
    .timeoutsAsyncScript(5000)
    .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
    .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account1, expenses1) // node.js context
    .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account2, expenses2) // node.js context
    .call(done);
  });

  it('should show the balance chart well sorted when we navigate to balance', function(done) {
    browser
    .waitFor(selector.list)
    .click(selector.list + ':nth-child(1)')
    .click(selector.appBarTab + ' div:nth-child(2)')
    .getText(selector.accountBalanceChart, function(err, text) {
      assert.deepEqual(text, [
        '6,66 €',
        '-6,66 €'
      ]);
    })
    .call(done);
  });

  it('should show the good amount to be transfer when we navigate to debts', function(done) {
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
      assert.isFalse(isExisting);
    })
    .call(done);
  });

  it('should show two balance chart when we have two currency', function(done) {
    browser
    .click(selector.list + ':nth-child(2)')
    .click(selector.appBarTab + ' div:nth-child(2)')
    .getText(selector.listSubheader, function(err, text) {
      assert.deepEqual(text, [
        'En €',
        'En $US',
      ]);
    })
    .getText(selector.accountBalanceChart, function(err, text) {
      assert.deepEqual(text, [
        '6,66 €',
        '-6,66 €',
        '6,66 $US',
        '-6,66 $US',
      ]);
    })
    .call(done);
  });

  it('should show two amounts to be transfer when we navigate to debts', function(done) {
    browser
    .click(selector.appBarTab + ' div:nth-child(3)')
    .getText(selector.listSubheader, function(err, text) {
      assert.deepEqual(text, [
        'En €',
        'En $US',
      ]);
    })
    .getText(selector.accountTransfer + ' div:nth-child(2)', function(err, text) {
      assert.deepEqual(text, [
        '6,66 €',
        '6,66 $US',
      ]);
    })
    .call(done);
  });

});
