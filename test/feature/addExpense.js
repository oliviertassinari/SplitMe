'use strict';

var assert = require('assert');

var selectorAddButton = '#button-main';
var selectorClose = '.mui-app-bar-navigation-icon-button';
var selectorSave = '.expense-save';
var selectorModal = '#main > div > .mui-dialog';
var selectorDatePicker = '.mui-date-picker-dialog';
var selectorPaidForDialog = '.expense-detail .mui-dialog:nth-child(8)';

describe('add new expense', function() {
  before(function(done) {
    browser
    .url('http://0.0.0.0:8000')
    .call(done);
  });

  it('should see new expense when we tap on main-button', function(done) {
    browser
    .click(selectorAddButton)
    .isExisting(selectorSave, function(err, isExisting) {
      assert.equal(true, isExisting);
    })
    .call(done);
  });

  it('should show a modal when we add an invalid expense', function(done) {
    browser
    .click(selectorSave)
    .waitFor(selectorModal + '.mui-is-shown')
    .click(selectorModal + ' .mui-dialog-window-action') // OK
    .waitForVisible(selectorModal, 1000, true)
    .call(done);
  });

  it('should see home when we close new expense', function(done) {
    browser
    .click(selectorClose)
    .isExisting(selectorSave, function(err, isExisting) { // Home
      assert.equal(false, isExisting);
    })
    .call(done);
  });

  it('should show a modal to confirm when we navigate back form new expense', function(done) {
    browser
    .click(selectorAddButton)
    .isExisting(selectorSave, function(err, isExisting) {
      assert.equal(true, isExisting);
    })
    .keys('Left arrow')
    .waitFor(selectorModal + '.mui-is-shown')
    .click(selectorModal + ' .mui-dialog-window-action:nth-child(1)') // Delete
    .waitForVisible(selectorModal, 1000, true)
    .isExisting(selectorSave, function(err, isExisting) { // Home
      assert.equal(false, isExisting);
    })
    .call(done);
  });

  function browserAddExpense(description, amount, dateIndex) {
    browser
    .click(selectorAddButton)
    .setValue('.expense-detail > .mui-text-field input', description)
    .setValue('.expense-detail-item:nth-child(2) input', amount)
    .click('.expense-detail-item:nth-child(7) input') // DatePicker
    .waitFor(selectorDatePicker + ' .mui-is-shown')
    .pause(200) // Wait the end of the transition
    .click(selectorDatePicker + ' .mui-date-picker-day-button:nth-child(' + dateIndex + ')')
    .click(selectorDatePicker + ' .mui-dialog-window-action:nth-child(2)') // OK
    .waitForVisible(selectorDatePicker, 1000, true)
    .click('.expense-detail-item:nth-child(4) input')
    .waitFor(selectorPaidForDialog + ' .mui-is-shown')
    .click(selectorPaidForDialog + ' .list .md-add')
    .waitForVisible(selectorPaidForDialog, 1000, true)
    .click(selectorSave)
    .pause(300)
    ;
  }

  it('should show home when we add a new expense', function(done) {
    browserAddExpense('Expense 1', 13.13, 1);

    browser
    .isExisting(selectorSave, function(err, isExisting) {
      assert.equal(false, isExisting);
    })
    .waitFor('.list:nth-child(1)')
    .getText('.list:nth-child(1) .mui-font-style-title', function(err, text) {
      assert.equal(text, '6,57 €');
    })
    .call(done);
  });

  it('should show home when we add a 2nd expense', function(done) {
    browserAddExpense('Expense 2', 13.13, 2);

    browser
    .isExisting(selectorSave, function(err, isExisting) {
      assert.equal(false, isExisting);
    })
    .pause(400) // Wait update
    .getText('.list:nth-child(1) .mui-font-style-title', function(err, text) {
      assert.equal(text, '13,13 €');
    })
    .call(done);
  });

  it('should show account when we tap on it', function(done) {
    browser
    .click('.mui-paper .list:nth-child(1)')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My name');
    })
    .getText('.mui-paper .list:nth-child(1) .list-content span', function(err, text) {
      assert.equal(text, 'Expense 2');
    })
    .getText('.mui-paper .list:nth-child(2) .list-content span', function(err, text) {
      assert.equal(text, 'Expense 1');
    })
    .call(done);
  });

  it('should show home when we close account', function(done) {
    browser
    .click(selectorClose)
    .isExisting(selectorSave, function(err, isExisting) {
      assert.equal(false, isExisting);
    })
    .call(done);
  });

  it('should show home when we navigate back form account', function(done) {
    browser
    .click('.mui-paper:nth-child(1) .list')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My name');
    })
    .keys('Left arrow')
    .isExisting(selectorSave, function(err, isExisting) {
      assert.equal(false, isExisting);
    })
    .call(done);
  });

  it('should show account when we navigate back form edit expense', function(done) {
    browser
    .click('.mui-paper:nth-child(1) .list')
    .click('.mui-paper:nth-child(1) .list')
    .click(selectorClose)
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My name');
    })
    .call(done);
  });

  it('should prefilled paidFor expense when we tap on add new expense', function(done) {
    browser
    .click(selectorAddButton)
    .elements('.expense-detail-item:nth-child(6) .list', function(err, res) {
      assert.equal(3, res.value.length);
    })
    .call(done);
  });

  it('should hide the modal when we navigate back', function(done) {
    browser
    .click(selectorSave)
    .waitFor(selectorModal + '.mui-is-shown')
    .keys('Left arrow')
    .waitForVisible(selectorModal, 1000, true)
    .call(done);
  });

  it('should show account when we close new expense', function(done) {
    browser
    .click(selectorClose)
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My name');
    })
    .call(done);
  });
});
