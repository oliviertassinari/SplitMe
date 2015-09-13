'use strict';

const assert = require('chai').assert;
const Immutable = require('immutable');

const selector = require('./selector');
const fixture = require('../fixture');

describe('delete expense', function() {
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

  it('should show account when we delete an expense', function(done) {
    browser
      .waitForExist(selector.listItem)
      .click(selector.listItem)
      .waitForExist(selector.listItem)
      .pause(100) // Wait will fetching expenses
      .elements(selector.listItem, function(err, res) {
        assert.lengthOf(res.value, 1);
      })
      .click(selector.listItem)
      .waitForExist(selector.expenseAddSave)
      .click(selector.bottomButton) // delete
      .waitForExist(selector.modal)
      .pause(400)
      .click(selector.modal + ' button:nth-child(2)') // OK
      .waitForExist(selector.bottomButton, 1000, true) // delete
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, 'AccountName1');
      })
      .elements(selector.listItem, function(err, res) {
        assert.lengthOf(res.value, 0);
      })
      .call(done);
  });
});
