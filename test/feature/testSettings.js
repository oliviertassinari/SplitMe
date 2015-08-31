'use strict';

var assert = require('chai').assert;

var selector = require('./selector');
var fixture = require('../fixture');

describe('edit expense', function() {
  before(function(done) {
    browser
      .url('http://0.0.0.0:8000')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .call(done);
  });

  it('should show settings when we tap on the settings button', function(done) {
    browser
      .click(selector.settings)
      .waitForExist(selector.settings, 1000, true)
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, 'Paramètres');
      })
      .call(done);
  });

  it('should show home when we navigate back', function(done) {
    browser
      .keys('Left arrow')
      .waitForExist(selector.settings)
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, 'Mes comptes');
      })
      .call(done);
  });

});
