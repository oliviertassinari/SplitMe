'use strict';

var Immutable = require('immutable');
var path = require('path');
var assert = require('chai').assert;
require('app-module-path').addPath(path.join(__dirname, '/../..'));

var fixtureBrowser = require('./fixtureBrowser');
var fixture = require('./fixture');
var API = require('API');

describe('fixtureBrowser', function() {
  before(function(done) {
    API.destroyAll().then(function() {
      done();
    });
  });

  describe('#saveAccountAndExpenses()', function() {
    it('should save two expenses when we provide two expenses', function(done) {
      var account = fixture.getAccount([{
        name: 'AccountName2',
        id: '12',
      }]);

      var expenses = new Immutable.List([
        fixture.getExpense({
          paidForContactIds: ['12'],
        }),
        fixture.getExpense({
          paidForContactIds: ['12'],
          currency: 'USD',
        }),
      ]);

      fixtureBrowser.saveAccountAndExpenses(account, expenses)
        .then(function(accountSaved) {
          return API.fetch(accountSaved.get('_id'));
        })
        .then(function(accountFetched) {
          assert.equal(accountFetched.get('expenses').size, 2);
          assert.equal(accountFetched.getIn(['members', 0, 'balances']).size, 2);
          done();
        });
    });
  });
});
