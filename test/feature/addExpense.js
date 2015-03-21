'use strict';

var assert = require('assert');

describe('add new expense', function() {
  it('should show home when we close add new expense', function(done) {
    browser
    .url('http://0.0.0.0:8000')
    .click('#main-button')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'New expense');
    })
    .click('#dom_id_0_1_0_0_5_1')
    .click('.mui-dialog-content .list')
    .pause(400) // Wait the overlay to hide
    .click('.mui-app-bar-navigation-icon-button')
    .getText('.mui-app-bar-title', function(err, text) {
      assert.equal(text, 'My accounts');
    })
    .call(done);
  });
});
