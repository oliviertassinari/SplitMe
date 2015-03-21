'use strict';

var assert = require('assert');

describe('add new expense', function() {
  it('should see home when we click on main-button', function(done) {
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
    .click('#dom_id_0_1_0_0_5_1')
    .click('.mui-dialog-content .list')
    .pause(400) // Wait the overlay to hide
    .click('.mui-app-bar-navigation-icon-button')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My accounts');
    })
    .call(done);
  });

  it('should show home when I add a new expense', function(done) {
    browser
    .url('http://0.0.0.0:8000')
    .click('#main-button')
    .setValue('#dom_id_0_1_0_0_0', 'Essence')
    .setValue('#dom_id_0_1_0_0_2_1', '13.13')
    .click('#dom_id_0_1_0_0_5_1')
    .waitFor('.mui-dialog-content .list .md-add', 1000)
    .click('.mui-dialog-content .list .md-add')
    .pause(400) // Wait the overlay to hide
    .click('.expense-save')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My accounts');
    })
    .waitFor('.list:nth-child(1)', 1000)
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
});
