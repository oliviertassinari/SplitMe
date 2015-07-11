'use strict';

var assert = require('chai').assert;
var selector = require('./selector');
var fixture = require('../fixture');

describe('edit account', function() {
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

  it('should show edit account when we tap on the settings button', function(done) {
    browser
      .waitFor(selector.list)
      .click(selector.list)
      .click(selector.accountEdit)
      .isExisting(selector.accountEditSave, function(err, isExisting) {
        assert.isTrue(isExisting);
      })
      .call(done);
  });

  it('should show detail when we tap on close account edit', function(done) {
    browser
      .click(selector.appBarLeftButton) // Close
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, 'AccountName1');
      })
      .call(done);
  });

  it('should show a modal when we add an invalid expense', function(done) {
    browser
      .click(selector.accountEdit)
      .setValue(selector.accountEditName, ' ')
      .keys('Back space') // Simulate an empty field
      .click(selector.accountEditSave)
      .waitFor(selector.modal)
      .pause(400)
      .click(selector.modal + ' button') // OK
      .waitForExist(selector.modal, 1000, true)
      .call(done);
  });

  it('should update the name of the account when enter an new name', function(done) {
    var newName = 'This is a new name';

    browser
      .setValue(selector.accountEditName, newName)
      .click(selector.accountEditSave)
      .pause(400)
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, newName);
      })
      .click(selector.appBarLeftButton) // Close
      .getText(selector.list + ' > div:nth-child(2)', function(err, text) {
        assert.equal(text, newName);
      })
      .call(done);
  });
});
