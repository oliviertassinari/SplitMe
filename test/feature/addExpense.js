'use strict';

var assert = require('assert');

describe('add new expense', function() {
  it('should see new expense when we click on main-button', function(done) {
    browser
    .url('http://0.0.0.0:8000')
    .click('#main-button')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'New expense');
    })
    .call(done);
  });

  it('should see home when we close new expense', function(done) {
    browser
    .click('.expense-detail-item:nth-child(5) input')
    .click('.mui-dialog-content .list:nth-child(2)')
    .pause(800) // Wait the overlay to hide
    .click('.mui-app-bar-navigation-icon-button') // Close
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My accounts');
    })
    .call(done);
  });

  it('should show home when we navigate back form new expense', function(done) {
    browser
    .click('#main-button')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'New expense');
    })
    .back()
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My accounts');
    })
    .call(done);
  });

  function browserAddExpense(description, amount, dateIndex) {
    browser
    .click('#main-button')
    .setValue('.expense-detail > .mui-text-field input', description)
    .setValue('.expense-detail-item:nth-child(2) input', amount)
    .click('.expense-detail-item:nth-child(3) input')
    .waitFor('.mui-date-picker-day-button', 1000)
    .click('.mui-date-picker-day-button:nth-child(' + dateIndex + ')')
    .click('.mui-dialog-window-action:nth-child(2)') // OK
    .pause(800) // Wait the overlay to hide
    .click('.expense-detail-item:nth-child(5) input')
    .waitFor('.mui-dialog-content .list .md-add', 1000)
    .click('.mui-dialog-content .list .md-add')
    .pause(800) // Wait the overlay to hide
    .click('.expense-save');
  }

  it('should show home when I add a new expense', function(done) {
    browserAddExpense('Expense 1', 13.13, 1);

    browser
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My accounts');
    })
    .waitFor('.list:nth-child(1)', 1000)
    .getText('.list:nth-child(1) .mui-font-style-title', function(err, text) {
      assert.equal(text, '6.56 €');
    })
    .call(done);
  });

  it('should show home when I add a 2nd expense', function(done) {
    browserAddExpense('Expense 2', 13.13, 2);

    browser
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My accounts');
    })
    .pause(100) // Wait update
    .getText('.list:nth-child(1) .mui-font-style-title', function(err, text) {
      assert.equal(text, '13.13 €');
    })
    .call(done);
  });

  it('should show account when we click on it', function(done) {
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
    .click('.mui-app-bar-navigation-icon-button') // Close
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My accounts');
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
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My accounts');
    })
    .call(done);
  });

  it('should show account when we navigate back form edit expense', function(done) {
    browser
    .click('.mui-paper:nth-child(1) .list')
    .click('.mui-paper:nth-child(1) .list')
    .click('.mui-app-bar-navigation-icon-button') // Close
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My name');
    })
    .call(done);
  });

});
