'use strict';

var assert = require('chai').assert;
var selector = require('./selector');

describe('add new expense', function() {
  before(function(done) {
    browser
    .url('http://0.0.0.0:8000')
    .call(done);
  });

  it('should show new expense when we tap on main-button', function(done) {
    browser
    .click(selector.mainActionButton)
    .isExisting(selector.expenseSave, function(err, isExisting) {
      assert.isTrue(isExisting);
    })
    .call(done);
  });

  it('should show a modal when we add an invalid expense', function(done) {
    browser
    .click(selector.expenseSave)
    .waitFor(selector.modal)
    .pause(400)
    .click(selector.modal + ' button') // OK
    .waitForVisible(selector.modal, 1000, true)
    .call(done);
  });

  it('should show home when we close new expense', function(done) {
    browser
    .click(selector.appBarLeftButton) // Close
    .isExisting(selector.expenseSave, function(err, isExisting) {
      assert.isFalse(isExisting);
    })
    .call(done);
  });

  it('should show a modal to confirm when we navigate back form new expense', function(done) {
    browser
    .click(selector.mainActionButton)
    .isExisting(selector.expenseSave, function(err, isExisting) {
      assert.isTrue(isExisting);
    })
    .keys('Left arrow')
    .waitFor(selector.modal)
    .pause(400)
    .click(selector.modal + ' button:nth-child(1)') // Delete
    .pause(400)
    .isExisting(selector.expenseSave, function(err, isExisting) {
      assert.isFalse(isExisting);
    })
    .call(done);
  });

  function browserAddExpense(description, amount, accountToUse) {
    browser
      .click(selector.mainActionButton)
      .setValue(selector.expenseAddDescription, description)
      .setValue(selector.expenseAddAmount, amount)
    ;

    if (typeof accountToUse === 'number') {
      browser
        .click(selector.expenseAddRelatedAccount)
        .waitFor(selector.expenseAddRelatedAccountDialog)
        .pause(400)
        .click(selector.expenseAddRelatedAccountDialog + ' ' + selector.list + ':nth-child(' + accountToUse + ')')
        .waitForVisible(selector.expenseAddRelatedAccountDialog, 1000, true)
      ;
    }

    browser
      .click(selector.expenseAddPaidBy)
      .waitFor(selector.expenseAddPaidByDialog)
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
      .waitForVisible(selector.expenseAddPaidByDialog, 1000, true)
      .click(selector.expenseSave)
      .pause(300)
    ;
  }

  it('should show home when we add a new expense', function(done) {
    browserAddExpense('Expense 1', 13.13);

    browser
    .isExisting(selector.expenseSave, function(err, isExisting) {
      assert.isFalse(isExisting);
    })
    .waitFor(selector.list)
    .getText(selector.list + ' div:nth-child(3) div:nth-child(2)', function(err, text) {
      assert.equal(text, '6,57 €');
    })
    .call(done);
  });

  it('should show home when we add a 2nd expense on the same account', function(done) {
    browserAddExpense('Expense 2', 13.13, 1);

    browser
    .isExisting(selector.expenseSave, function(err, isExisting) {
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
    .getText(selector.list + ':nth-child(1) div:nth-child(2) span', function(err, text) {
      assert.equal(text, 'Expense 2');
    })
    .getText(selector.list + ':nth-child(2) div:nth-child(2) span', function(err, text) {
      assert.equal(text, 'Expense 1');
    })
    .call(done);
  });

  it('should show home when we close account', function(done) {
    browser
    .click(selector.appBarLeftButton) // Close
    .isExisting(selector.expenseSave, function(err, isExisting) {
      assert.isFalse(isExisting);
    })
    .call(done);
  });

  it('should show home when we navigate back form account', function(done) {
    browser
    .click(selector.list)
    .getText(selector.appBarTitle, function(err, text) {
      assert.equal(text, 'Alexandre Dupont');
    })
    .keys('Left arrow')
    .isExisting(selector.expenseSave, function(err, isExisting) {
      assert.isFalse(isExisting);
    })
    .call(done);
  });

  it('should show account when we navigate back form edit expense', function(done) {
    browser
    .click(selector.list)
    .click(selector.list)
    .click(selector.appBarLeftButton) // Close
    .getText(selector.appBarTitle, function(err, text) {
      assert.equal(text, 'Alexandre Dupont');
    })
    .call(done);
  });

  it('should prefilled paidFor expense when we tap on add new expense', function(done) {
    browser
    .click(selector.mainActionButton)
    .elements(selector.expenseAddPaidFor + ' ' + selector.list, function(err, res) {
      assert.lengthOf(res.value, 3);
    })
    .call(done);
  });

  it('should hide the modal when we navigate back', function(done) {
    browser
    .click(selector.expenseSave)
    .waitFor(selector.modal)
    .pause(400)
    .keys('Left arrow')
    .waitForVisible(selector.modal, 1000, true)
    .call(done);
  });

  it('should show account when we close new expense', function(done) {
    browser
    .click(selector.appBarLeftButton) // Close
    .getText(selector.appBarTitle, function(err, text) {
      assert.equal(text, 'Alexandre Dupont');
    })
    .call(done);
  });
});
