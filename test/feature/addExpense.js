'use strict';

var assert = require('assert');

describe('addExpense', function() {
  it('should show expense when we add expense', function(done) {
    browser
    .url('http://0.0.0.0:8000')
    .title(function(err, res) {
        console.log('Title was: ' + res.value);
    })
    .call(done);
  });
});
