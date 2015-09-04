'use strict';

var assert = require('chai').assert;
var Immutable = require('immutable');

var selector = require('./selector');
var fixture = require('../fixture');

describe('edit account', function() {
  before(function(done) {
    var account = fixture.getAccount([{
      name: 'AccountName1',
      id: '10',
    }]);

    var expenses = new Immutable.List([
      fixture.getExpense({
        paidForContactIds: ['10'],
      }),
    ]);

    browser
      .url('http://0.0.0.0:8000')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account.toJS(), expenses.toJS()) // node.js context
      .call(done);
  });

  it('should show edit account when we tap on the settings button', function(done) {
    browser
      .waitFor(selector.list)
      .click(selector.list)
      .waitFor(selector.accountMore)
      .click(selector.accountMore)
      .waitFor(selector.accountEditButton)
      .click(selector.accountEditButton)
      .waitForExist(selector.accountEditSave)
      .call(done);
  });

  it('should show detail when we tap on close account edit', function(done) {
    browser
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.accountEditSave, 1000, true)
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, 'AccountName1');
      })
      .call(done);
  });

  it('should update the name of the account when enter an new name', function(done) {
    var newName = 'This is a new name';

    browser
      .click(selector.accountMore)
      .waitFor(selector.accountEditButton)
      .click(selector.accountEditButton)
      .waitForExist(selector.accountEditName)
      .setValue(selector.accountEditName, newName)
      .click(selector.accountEditSave)
      .pause(400)
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, newName);
      })
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.accountEditSave, 1000, true)
      .getText(selector.list + ' > div:nth-child(2)', function(err, text) {
        assert.equal(text, newName);
      })
      .call(done);
  });
});
