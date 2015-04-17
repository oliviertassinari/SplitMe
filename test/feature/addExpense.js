'use strict';

var assert = require('assert');

var selectorAddButton = '#button-main';
var selectorClose = '.mui-app-bar-navigation-icon-button';
var selectorSave = '.expense-save';

describe('add new expense', function() {
  before(function(done) {
    browser
    .url('http://0.0.0.0:8000')
    .call(done);
  });

  it('should see new expense when we tap on main-button', function(done) {
    browser
    .click(selectorAddButton)
    .url(function(err, res) {
      assert.equal(res.value, 'http://0.0.0.0:8000/add');
    })
    .call(done);
  });

  it('should see show a modal we add an invalid expense', function(done) {
    browser
    .click('.expense-detail-item:nth-child(4) input')
    .click('.mui-dialog-content .list:nth-child(2)')
    .pause(800) // Wait the overlay to hide
    .click(selectorSave)
    .url(function(err, res) {
      assert.equal(res.value, 'http://0.0.0.0:8000/add/modal');
    })
    .waitFor('.mui-dialog-window-action', 1000)
    .click('#main > div > .mui-dialog .mui-dialog-window-action') // OK
    .pause(500)
    .call(done);
  });

  it('should see home when we close new expense', function(done) {
    browser
    .click(selectorClose)
    .url(function(err, res) {
      assert.equal(res.value, 'http://0.0.0.0:8000/');
    })
    .call(done);
  });

  it('should show home when we navigate back form new expense', function(done) {
    browser
    .click(selectorAddButton)
    .url(function(err, res) {
      assert.equal(res.value, 'http://0.0.0.0:8000/add');
    })
    .back()
    .url(function(err, res) {
      assert.equal(res.value, 'http://0.0.0.0:8000/');
    })
    .call(done);
  });

  function browserAddExpense(description, amount, dateIndex) {
    browser
    .click(selectorAddButton)
    .setValue('.expense-detail > .mui-text-field input', description)
    .setValue('.expense-detail-item:nth-child(2) input', amount)
    .click('.expense-detail-item:nth-child(7) input') // DatePicker
    .pause(800) // Wait the overlay to show
    .click('.mui-date-picker-day-button:nth-child(' + dateIndex + ')')
    .click('.mui-dialog-window-action:nth-child(2)') // OK
    .pause(800) // Wait the overlay to hide
    .click('.expense-detail-item:nth-child(4) input')
    .waitFor('.mui-dialog-content .list .md-add', 1000)
    .click('.mui-dialog-content .list .md-add')
    .pause(800) // Wait the overlay to hide
    .click(selectorSave)
    .pause(300) // Wait the overlay to hide
    ;
  }

  it('should show home when we add a new expense', function(done) {
    browserAddExpense('Expense 1', 13.13, 1);

    browser
    .url(function(err, res) {
      assert.equal(res.value, 'http://0.0.0.0:8000/');
    })
    .waitFor('.list:nth-child(1)', 1000)
    .getText('.list:nth-child(1) .mui-font-style-title', function(err, text) {
      assert.equal(text, '6,57 €');
    })
    .call(done);
  });

  it('should show home when we add a 2nd expense', function(done) {
    browserAddExpense('Expense 2', 13.13, 2);

    browser
    .url(function(err, res) {
      assert.equal(res.value, 'http://0.0.0.0:8000/');
    })
    .pause(400) // Wait update
    .getText('.list:nth-child(1) .mui-font-style-title', function(err, text) {
      assert.equal(text, '13,13 €');
    })
    .call(done);
  });

  it('should show account when we tap on it', function(done) {
    browser
    .click('.mui-paper:nth-child(1) .list')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My name');
    })
    .getText('.mui-paper:nth-child(1) .list-content span', function(err, text) {
      assert.equal(text, 'Expense 2');
    })
    .getText('.mui-paper:nth-child(2) .list-content span', function(err, text) {
      assert.equal(text, 'Expense 1');
    })
    .call(done);
  });

  it('should show home when we close account', function(done) {
    browser
    .click(selectorClose)
    .url(function(err, res) {
      assert.equal(res.value, 'http://0.0.0.0:8000/');
    })
    .call(done);
  });

  it('should show home when we navigate back form account', function(done) {
    browser
    .click('.mui-paper:nth-child(1) .list')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My name');
    })
    .back()
    .url(function(err, res) {
      assert.equal(res.value, 'http://0.0.0.0:8000/');
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

  it('should show account when we close new expense', function(done) {
    browser
    .click(selectorClose)
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My name');
    })
    .call(done);
  });
});
