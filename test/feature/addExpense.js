'use strict';

var assert = require('assert');

describe('addExpense', function() {
  it('should show home when we close paidBy and expense', function(done) {
    browser
    .url('http://0.0.0.0:8000')
    .click('#main-button')
    .click('#dom_id_0_1_0_0_5_1')
    .click('.mui-dialog-content .list')
    .pause(500) // Wait the overlay to disapre
    .click('.mui-app-bar-navigation-icon-button')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My accounts');
    })
    .call(done);
  });
});
