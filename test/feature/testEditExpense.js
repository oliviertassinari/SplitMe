'use strict';

var assert = require('chai').assert;
var Immutable = require('immutable');

var selector = require('./selector');
var fixture = require('../fixture');

describe('edit expense', function() {
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

  it('should show account when we navigate back form an expense we didn\'t edit', function(done) {
    browser
      .waitForExist(selector.list)
      .click(selector.list)
      .waitForExist(selector.list)
      .click(selector.list)
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
      .click(selector.modal + ' button:nth-child(2)') // Cancel
      .waitForExist(selector.modal, 1000, true)
      .call(done);
  });

  it('should update balance when we edit the amount of an expense', function(done) {
    browser
      .click(selector.expenseAddSave)
      .pause(400) // Wait update
      .getText(selector.list + ' div:nth-child(2) span', function(err, text) {
        assert.equal(text, 'descriptionEdit');
      })
      .getText(selector.list + ' div:nth-child(3)', function(err, text) {
        assert.equal(text, '10,00 €');
      })
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.appBarLeftButton, 1000, true)
      .getText(selector.list + ' div:nth-child(3) div:nth-child(2)', function(err, text) {
        assert.equal(text, '5,00 €');
      })
      .call(done);
  });

  it('should update balance when we edit paidFor', function(done) {
    browser
      .click(selector.list)
      .click(selector.list)
      .waitForExist(selector.expenseAddPaidFor)
      .scroll(selector.expenseAddPaidFor + ' ' + selector.list + ':nth-child(2)')
      .click(selector.expenseAddPaidFor + ' ' + selector.list + ':nth-child(2)')
      .click(selector.expenseAddSave)
      .pause(400)
      .click(selector.appBarLeftButton) // Close
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
      .waitForExist(selector.expenseAddCurrency)
      .click(selector.expenseAddCurrency)
      .waitForExist(selector.expenseAddCurrency + ' div:nth-child(2)')
      .click(selector.expenseAddCurrency + ' div:nth-child(2) div:nth-child(2)')
      .click(selector.expenseAddSave)
      .pause(400) // Wait update
      .getText(selector.list + ' div:nth-child(3)', function(err, text) {
        assert.equal(text, '10,00 $US');
      })
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.appBarLeftButton, 1000, true)
      .getText(selector.list + ' div:nth-child(3) div:nth-child(2)', function(err, text) {
        assert.equal(text, '10,00 $US');
      })
      .call(done);
  });

  it('should update balance when we add a new member', function(done) {
    browser
      .click(selector.list)
      .click(selector.list)
      .waitForExist(selector.expenseAddPaidFor)
      .scroll(selector.expenseAddPaidFor + ' ' + selector.list + ':nth-child(4)')
      .click(selector.expenseAddPaidFor + ' ' + selector.list + ':nth-child(2)') // Add me back
      .click(selector.expenseAddPaidFor + ' ' + selector.list + ':nth-child(4)')
      .click(selector.expenseAddSave)
      .pause(400) // Wait update
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.appBarLeftButton, 1000, true)
      .getText(selector.list + ' div:nth-child(3) div:nth-child(2)', function(err, text) {
        assert.equal(text, '6,67 $US');
      })
      .call(done);
  });

});
