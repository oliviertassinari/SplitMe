'use strict';

const assert = require('chai').assert;
const Immutable = require('immutable');

const selector = require('./selector');
const fixture = require('../fixture');

describe('edit expense', function() {
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

  it('should show account when we navigate back form an expense we didn\'t edit', function(done) {
    browser
      .waitForExist(selector.list)
      .click(selector.list)
      .waitForExist(selector.accountMore)
      .click(selector.list)
      .waitForExist(selector.expenseAddDescription)
      .keys('Left arrow')
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, 'AccountName1');
      })
      .call(done);
  });

  it('should show a modal to confirm when we navigate back form an expense we edit', function(done) {
    browser
      .click(selector.list)
      .waitForExist(selector.expenseAddDescription)
      .setValue(selector.expenseAddDescription, 'descriptionEdit')
      .setValue(selector.expenseAddAmount, 10)
      .keys('Left arrow')
      .waitForExist(selector.modal)
      .pause(400)
      .click(selector.modal + ' button:nth-child(1)') // Cancel
      .waitForExist(selector.modal, 1000, true)
      .call(done);
  });

  it('should update balance when we edit the amount of an expense', function(done) {
    browser
      .click(selector.expenseAddSave)
      .waitForExist(selector.expenseAddSave, 1000, true)
      .pause(100) // Update
      .getText(selector.expenseList + ' span', function(err, text) {
        assert.equal(text, 'descriptionEdit');
      })
      .getText(selector.expenseListAmount, function(err, text) {
        assert.equal(text, '10,00 €');
      })
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.settings) // Home
      .getText(selector.listBalance + ' div:nth-child(2)', function(err, text) {
        assert.equal(text, '5,00 €');
      })
      .call(done);
  });

  it('should update balance when we edit paidFor', function(done) {
    browser
      .click(selector.list)
      .waitForExist(selector.settings, 1000, true) // Expense detail
      .click(selector.list)
      .waitForExist(selector.expenseAddPaidFor)
      .scroll(selector.expenseAddPaidFor + ' ' + selector.list + ':nth-child(2)')
      .click(selector.expenseAddPaidFor + ' ' + selector.list + ':nth-child(2)')
      .click(selector.expenseAddSave)
      .waitForExist(selector.expenseAddSave, 1000, true)
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.settings) // Home
      .pause(400) // Update
      .getText(selector.listBalance + ' div:nth-child(2)', function(err, text) {
        assert.equal(text, '10,00 €');
      })
      .call(done);
  });

  it('should update balance when we edit currency', function(done) {
    browser
      .click(selector.list)
      .waitForExist(selector.settings, 1000, true) // Expense detail
      .click(selector.list)
      .waitForExist(selector.expenseAddCurrency)
      .click(selector.expenseAddCurrency)
      .waitForExist(selector.expenseAddCurrency + ' div:nth-child(2)')
      .click(selector.expenseAddCurrency + ' div:nth-child(2) div:nth-child(2)')
      .click(selector.expenseAddSave)
      .waitForExist(selector.expenseAddSave, 1000, true)
      .getText(selector.expenseListAmount, function(err, text) {
        assert.equal(text, '10,00 $US');
      })
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.settings) // Home
      .pause(400) // Update
      .getText(selector.listBalance + ' div:nth-child(2)', function(err, text) {
        assert.equal(text, '10,00 $US');
      })
      .call(done);
  });

  it('should update balance when we add a new member', function(done) {
    browser
      .click(selector.list)
      .waitForExist(selector.settings, 1000, true) // Expense detail
      .click(selector.list)
      .waitForExist(selector.expenseAddPaidFor)
      .scroll(selector.expenseAddPaidFor + ' div:nth-child(4) ' + selector.list)
      .click(selector.expenseAddPaidFor + ' div:nth-child(4) ' + selector.list)
      .click(selector.expenseAddPaidFor + ' ' + selector.list + ':nth-child(2)') // Add me back
      .click(selector.expenseAddSave)
      .waitForExist(selector.expenseAddSave, 1000, true)
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.settings) // Home
      .pause(400) // Update
      .getText(selector.listBalance + ' div:nth-child(2)', function(err, text) {
        assert.equal(text, '6,67 $US');
      })
      .call(done);
  });

});
