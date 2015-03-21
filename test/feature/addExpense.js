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
    .click('.mui-dialog-content .list')
    .pause(400) // Wait the overlay to hide
    .click('.mui-app-bar-navigation-icon-button')
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

  it('should show home when I add a new expense', function(done) {
    browser
    .click('#main-button')
    .setValue('.expense-detail > .mui-text-field input', 'Essence')
    .setValue('.expense-detail-item:nth-child(2) input', '13.13')
    .click('.expense-detail-item:nth-child(5) input')
    .waitFor('.mui-dialog-content .list .md-add', 1000)
    .click('.mui-dialog-content .list .md-add')
    .pause(400) // Wait the overlay to hide
    .click('.expense-save')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My accounts');
    })
    .waitFor('.list:nth-child(1)', 1000)
    .getText('.list:nth-child(1) .mui-font-style-title', function(err, text) {
      assert.equal(text, '6.56 €');
    })
    .call(done);
  });

  it('should show account when we click on it', function(done) {
    browser
    .click('.list:nth-child(1)')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My name');
    })
    .call(done);
  });

  it('should show home when we close account', function(done) {
    browser
    .click('.mui-app-bar-navigation-icon-button')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My accounts');
    })
    .call(done);
  });

  it('should show home when we navigate back form account', function(done) {
    browser
    .click('.list:nth-child(1)')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My name');
    })
    .back()
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My accounts');
    })
    .call(done);
  });
});
