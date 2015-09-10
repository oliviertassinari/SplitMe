'use strict';

const assert = require('chai').assert;
const Immutable = require('immutable');

const selector = require('./selector');
const fixture = require('../fixture');

describe('edit account', function() {
  before(function(done) {
    const account = fixture.getAccount([{
      name: 'AccountName1',
      id: '10',
    }]);

    const expenses = new Immutable.List([
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
      .waitForExist(selector.list)
      .click(selector.list)
      .waitForExist(selector.accountMore)
      .click(selector.accountMore)
      .waitForExist(selector.accountEditSetting)
      .click(selector.accountEditSetting)
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
    const newName = 'This is a new name';

    browser
      .click(selector.accountMore)
      .waitForExist(selector.accountEditSetting)
      .click(selector.accountEditSetting)
      .waitForExist(selector.accountEditName)
      .setValue(selector.accountEditName, newName)
      .click(selector.accountEditSave)
      .waitForExist(selector.accountEditSave, 1000, true)
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, newName);
      })
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.settings) // Home
      .getText(selector.list + ' > div > div > div:nth-child(3)', function(err, text) {
        assert.equal(text, newName);
      })
      .call(done);
  });

  it('should delete the account when we tap on the delete button', function(done) {
    browser
      .click(selector.list)
      .waitForExist(selector.accountMore)
      .click(selector.accountMore)
      .waitForExist(selector.accountEditDelete)
      .pause(200)
      .click(selector.accountEditDelete)
      .waitForExist(selector.modal)
      .pause(400)
      .click(selector.modal + ' button:nth-child(2)') // OK
      .waitForExist(selector.settings) // Home
      .getText(selector.list, function(err, text) {
        assert.equal(text, undefined);
      })
      .call(done);
  });
});
