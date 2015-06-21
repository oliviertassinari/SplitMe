'use strict';

var assert = require('chai').assert;
var selector = require('./selector');
var fixture = require('../fixture');

describe('delete expense', function() {
  before(function(done) {
    var account1 = fixture.getAccount([{
      name: 'AccountName1',
      id: '10'
    }]);
    var expenses1 = [
      fixture.getExpense({
        contactId: '10'
      }),
    ];

    browser
    .url('http://0.0.0.0:8000')
    .timeoutsAsyncScript(5000)
    .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
    .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account1, expenses1) // node.js context
    .call(done);
  });

  it('should show account when we delete an expense', function(done) {
    browser
    .waitFor(selector.list)
    .click(selector.list)
    .waitFor(selector.list)
    .elements(selector.list, function(err, res) {
      assert.lengthOf(res.value, 1);
    })
    .click(selector.list)
    .click(selector.bottomButton) // delete
    .waitFor(selector.modal)
    .pause(300)
    .click(selector.modal + ' button:nth-child(2)') // OK
    .pause(300)
    .getText(selector.appBarTitle, function(err, text) {
      assert.equal(text, 'AccountName1');
    })
    .pause(300)
    .elements(selector.list, function(err, res) {
      assert.lengthOf(res.value, 0);
    })
    .call(done);
  });
});
