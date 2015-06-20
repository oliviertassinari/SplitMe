'use strict';

var assert = require('chai').assert;
var selector = require('./selector');
var fixture = require('../fixture');

describe('detail account', function() {
  before(function(done) {
    var expense1 = fixture.getExpense('10');
    expense1.account = fixture.getAccount([{
      name: 'AccountName1',
      id: '10'
    }]);

    var expense2 = fixture.getExpense('12');
    expense2.account = fixture.getAccount([{
      name: 'AccountName2',
      id: '12'
    }]);

    browser
    .url('http://0.0.0.0:8000')
    .timeoutsAsyncScript(5000)
    .executeAsync(fixture.executeAsyncSaveExpenses, [expense1, expense2], function(err) { // node.js context
      if(err) {
        throw err;
      }
    })
    .call(done);
  });

  it('should show the balance chart well sorted when we navigate to balance', function(done) {
    browser
    .waitFor(selector.list)
    .click(selector.list)
    .click(selector.appBarTab + ' div:nth-child(2)')
    .getText(selector.accountBalanceChart, function(err, text) {
      assert.deepEqual(text, [
        '6,66 €',
        '-6,66 €'
      ]);
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
      assert.isFalse(isExisting);
    })
    .call(done);
  });
});
