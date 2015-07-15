'use strict';

var path = require('path');
require('app-module-path').addPath(path.join(__dirname, '/../..'));

var assert = require('chai').assert;
var fixture = require('../../../test/fixture');
var expenseStore = require('Main/Expense/store');
var API = require('API');

describe('expenseStore', function() {
  before(function(done) {
    API.destroyAll().then(function() {
      done();
    });
  });

  describe('#saveAccountAndExpenses()', function() {
    it('should save two expenses when we provide two expenses', function(done) {
      var account = fixture.getAccount([{
        name: 'AccountName2',
        id: '12'
      }]);

      var expenses = [
        fixture.getExpense({
          contactIds: ['12'],
        }),
        fixture.getExpense({
          contactIds: ['12'],
        }),
      ];

      expenseStore.saveAccountAndExpenses(account, expenses).then(function() {
        API.fetchAccount(account._id).then(function(accountFetched) {
          var expensesFetched = accountFetched.expenses;

          assert.lengthOf(expensesFetched, 2);
          done();
        });
      });
    });
  });
});
