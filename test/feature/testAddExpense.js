'use strict';

var assert = require('chai').assert;

var selector = require('./selector');
var fixture = require('../fixture');

describe('add new expense', function() {
  before(function(done) {
    browser
      .url('http://0.0.0.0:8000')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .call(done);
  });

  it('should show new expense when we tap on main-button', function(done) {
    browser
      .click(selector.mainActionButton)
      .waitForExist(selector.expenseAddSave)
      .call(done);
  });

  it('should show a modal when we add an invalid expense', function(done) {
    browser
      .click(selector.expenseAddSave)
      .waitForExist(selector.modal)
      .pause(400)
      .click(selector.modal + ' button') // OK
      .waitForExist(selector.modal, 1000, true)
      .call(done);
  });

  it('should show home when we close new expense', function(done) {
    browser
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.expenseAddSave, 1000, true)
      .call(done);
  });

  it('should show a modal to confirm when we navigate back form new expense', function(done) {
    browser
      .click(selector.mainActionButton)
      .waitForExist(selector.expenseAddSave)
      .keys('Left arrow')
      .waitForExist(selector.modal)
      .pause(400)
      .click(selector.modal + ' button:nth-child(2)') // Delete
      .pause(400)
      .isExisting(selector.expenseAddSave, function(err, isExisting) {
        assert.isFalse(isExisting);
      })
      .call(done);
  });

  function browserAddExpense(description, amount, accountToUse) {
    browser
      .click(selector.mainActionButton)
      .waitForExist(selector.expenseAddDescription)
      .setValue(selector.expenseAddDescription, description)
      .setValue(selector.expenseAddAmount, amount)
    ;

    if (typeof accountToUse === 'number') {
      browser
        .click(selector.expenseAddRelatedAccount)
        .waitForExist(selector.expenseAddRelatedAccountDialog)
        .pause(400)
        .click(selector.expenseAddRelatedAccountDialog + ' ' + selector.list + ':nth-child(' + accountToUse + ')')
        .waitForExist(selector.expenseAddRelatedAccountDialog, 1000, true)
      ;
    }

    browser
      .click(selector.expenseAddPaidBy)
      .waitForExist(selector.expenseAddPaidByDialog)
      .pause(400)
    ;

    if (typeof accountToUse === 'number') {
      browser
        .click(selector.expenseAddPaidByDialog + ' ' + selector.list + ':nth-child(2)')
      ;
    } else {
      browser
        .click(selector.expenseAddPaidByDialogIcon)
      ;
    }

    browser
      .waitForExist(selector.expenseAddPaidByDialog, 1000, true)
      .click(selector.expenseAddSave)
      .pause(300)
    ;
  }

  it('should show home when we add a new expense', function(done) {
    browserAddExpense('Expense 1', 13.13);

    browser
      .isExisting(selector.expenseAddSave, function(err, isExisting) {
        assert.isFalse(isExisting);
      })
      .waitForExist(selector.list)
      .getText(selector.list + ' div:nth-child(3) div:nth-child(2)', function(err, text) {
        assert.equal(text, '6,57 €');
      })
      .call(done);
  });

  it('should show home when we add a 2nd expense on the same account', function(done) {
    browserAddExpense('Expense 2', 13.13, 1);

    browser
      .isExisting(selector.expenseAddSave, function(err, isExisting) {
        assert.isFalse(isExisting);
      })
      .pause(400) // Wait update
      .getText(selector.list + ' div:nth-child(3) div:nth-child(2)', function(err, text) {
        assert.equal(text, '13,13 €');
      })
      .call(done);
  });

  it('should show account when we tap on it', function(done) {
    browser
      .click(selector.list)
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, 'Alexandre Dupont');
      })
      .getText(selector.list + ' div:nth-child(2) span', function(err, text) {
        assert.deepEqual(text, [
          'Expense 2',
          'Expense 1',
        ]);
      })
      .call(done);
  });

  it('should show home when we close account', function(done) {
    browser
      .click(selector.appBarLeftButton) // Close
      .isExisting(selector.expenseAddSave, function(err, isExisting) {
        assert.isFalse(isExisting);
      })
      .call(done);
  });

  it('should show home when we navigate back form account', function(done) {
    browser
      .click(selector.list)
      .waitForExist(selector.appBarLeftButton)
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, 'Alexandre Dupont');
      })
      .keys('Left arrow')
      .isExisting(selector.expenseAddSave, function(err, isExisting) {
        assert.isFalse(isExisting);
      })
      .call(done);
  });

  it('should show account when we navigate back form edit expense', function(done) {
    browser
      .click(selector.list)
      .click(selector.list)
      .waitForExist(selector.appBarLeftButton)
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.expenseAddSave, 1000, true)
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, 'Alexandre Dupont');
      })
      .call(done);
  });

  it('should prefilled paidFor expense when we tap on add new expense', function(done) {
    browser
      .click(selector.mainActionButton)
      .waitForExist(selector.expenseAddPaidFor)
      .elements(selector.expenseAddPaidFor + ' ' + selector.list, function(err, res) {
        assert.lengthOf(res.value, 3);
      })
      .call(done);
  });

  it('should hide the modal when we navigate back', function(done) {
    browser
      .click(selector.expenseAddSave)
      .waitForExist(selector.modal)
      .pause(400)
      .keys('Left arrow')
      .waitForExist(selector.modal, 1000, true)
      .call(done);
  });

  it('should show account when we close new expense', function(done) {
    browser
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.expenseAddSave, 1000, true)
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, 'Alexandre Dupont');
      })
      .keys('Left arrow')
      .call(done);
  });

  it('should show new account in the list when we add a new expense', function(done) {
    browserAddExpense('Expense 3', 13.13);

    browser
      .waitForExist(selector.list + ':nth-child(2)')
      .getText(selector.list + ' div:nth-child(3) div:nth-child(2)', function(err, text) {
        assert.deepEqual(text, [
          '13,13 €',
          '6,57 €',
        ]);
      })
      .call(done);
  });

});
