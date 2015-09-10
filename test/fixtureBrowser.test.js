'use strict';

const Immutable = require('immutable');
const path = require('path');
const assert = require('chai').assert;
require('app-module-path').addPath(path.join(__dirname, '/../..'));

const fixtureBrowser = require('./fixtureBrowser');
const fixture = require('./fixture');
const API = require('API');

describe('fixtureBrowser', function() {
  // runs before all tests in this block
  before(function(done) {
    API.destroyAll().then(function() {
      done();
    }).catch(function(err) {
      console.log(err);
    });
  });

  describe('#saveAccountAndExpenses()', function() {
    it('should save two expenses when we provide two expenses', function(done) {
      const account = fixture.getAccount([{
        name: 'AccountName2',
        id: '12',
      }]);

      const expenses = new Immutable.List([
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
