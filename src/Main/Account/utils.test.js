'use strict';

var Immutable = require('immutable');
var assert = require('chai').assert;
var path = require('path');
require('app-module-path').addPath(path.join(__dirname, '../../'));

var fixture = require('../../../test/fixture');
var accountUtils = require('Main/Account/utils');

describe('account utils', function() {
  describe('#addExpenseToAccount()', function() {
    it('should have updated accounts when adding an expense', function() {
      var expense = fixture.getExpenseEqualy1();
      var account = fixture.getAccount([
        {
          name: 'A',
          id: '10',
        },
        {
          name: 'B',
          id: '11',
        },
      ]);

      account = accountUtils.addExpenseToAccount(expense, account);

      assert.closeTo(account.getIn(['members', 0, 'balances', 0, 'value']), 8.87, 0.01);
      assert.closeTo(account.getIn(['members', 1, 'balances', 0, 'value']), -4.44, 0.01);
      assert.closeTo(account.getIn(['members', 2, 'balances', 0, 'value']), -4.44, 0.01);
      assert.equal(account.get('expenses').size, 1);
      assert.equal(account.get('dateLastExpense'), '2015-03-21');
    });
  });

  describe('#removeExpenseOfAccount()', function() {
    it('should have remove account\'s balance when removing the only one expense', function() {
      var expense = fixture.getExpenseEqualy1();
      var account = fixture.getAccount([
        {
          name: 'A',
          id: '10',
        },
        {
          name: 'B',
          id: '11',
        },
      ]);

      account = accountUtils.addExpenseToAccount(expense, account);
      account = accountUtils.removeExpenseOfAccount(expense, account);

      assert.equal(account.getIn(['members', 0, 'balances']).size, 0);
      assert.equal(account.getIn(['members', 1, 'balances']).size, 0);
      assert.equal(account.getIn(['members', 2, 'balances']).size, 0);
      assert.equal(account.get('expenses').size, 0);
      assert.equal(account.get('dateLastExpense'), null);
    });

    it('should have updated account\'s balance when removing an expense in USD', function() {
      var expense1 = fixture.getExpenseEqualy1();
      var expense2 = fixture.getExpense({
        currency: 'USD',
        paidForContactIds: ['10', '11'],
      });
      var account = fixture.getAccount([
        {
          name: 'A',
          id: '10',
        },
        {
          name: 'B',
          id: '11',
        },
      ]);

      account = accountUtils.addExpenseToAccount(expense1, account);
      account = accountUtils.addExpenseToAccount(expense2, account);
      account = accountUtils.removeExpenseOfAccount(expense2, account);

      assert.equal(account.getIn(['members', 0, 'balances']).size, 1);
      assert.closeTo(account.getIn(['members', 0, 'balances', 0, 'value']), 8.87, 0.01);
      assert.equal(account.getIn(['members', 1, 'balances']).size, 1);
      assert.closeTo(account.getIn(['members', 1, 'balances', 0, 'value']), -4.44, 0.01);
      assert.equal(account.getIn(['members', 2, 'balances']).size, 1);
      assert.closeTo(account.getIn(['members', 2, 'balances', 0, 'value']), -4.44, 0.01);
      assert.equal(account.getIn(['expenses']).size, 1);
      assert.equal(account.get('dateLastExpense'), '2015-03-21');
    });
  });

  describe('#getTransfersForSettlingMembers()', function() {
    it('should optimal transfers when there are members settled', function() {
      var members = Immutable.fromJS([
        {
          id: '0',
          balances: [{
            currency: 'EUR',
            value: 0,
          }],
        },
        {
          id: '1',
          balances: [{
            currency: 'EUR',
            value: 0,
          }],
        },
        {
          id: '2',
          balances: [{
            currency: 'EUR',
            value: 0,
          }],
        },
      ]);

      var transfers = accountUtils.getTransfersForSettlingMembers(members, 'EUR');
      assert.lengthOf(transfers, 0);
    });

    it('should have optimal transfers when in a simple case', function() {
      var members = Immutable.fromJS([
        {
          id: '0',
          balances: [{
            currency: 'EUR',
            value: 20,
          }],
        },
        {
          id: '1',
          balances: [{
            currency: 'EUR',
            value: 0,
          }],
        },
        {
          id: '2',
          balances: [{
            currency: 'EUR',
            value: -20,
          }],
        },
      ]);

      var transfers = accountUtils.getTransfersForSettlingMembers(members, 'EUR');
      assert.lengthOf(transfers, 1);
      assert.equal(transfers[0].from.get('id'), '2');
      assert.equal(transfers[0].to.get('id'), '0');
      assert.equal(transfers[0].amount, 20);
      assert.equal(transfers[0].currency, 'EUR');
    });

    it('should have optimal transfers when in a complexe case', function() {
      var members = fixture.getMembersWhereBalanceComplexe();

      var transfers = accountUtils.getTransfersForSettlingMembers(members, 'EUR');
      assert.lengthOf(transfers, 3);
      assert.equal(transfers[0].from.get('id'), '2');
      assert.equal(transfers[0].to.get('id'), '3');
      assert.equal(transfers[0].amount, 30);

      assert.equal(transfers[1].from.get('id'), '2');
      assert.equal(transfers[1].to.get('id'), '1');
      assert.equal(transfers[1].amount, 20);

      assert.equal(transfers[2].from.get('id'), '0');
      assert.equal(transfers[2].to.get('id'), '1');
      assert.equal(transfers[2].amount, 10);
    });
  });

  describe('#getCurrenciesWithMembers()', function() {
    it('should return currencies of balacnes of members when there are balances', function() {
      var members = fixture.getMembersWhereBalanceComplexe();
      var currencies = accountUtils.getCurrenciesWithMembers(members);

      assert.sameMembers(currencies, ['USD', 'EUR']);
    });
  });

  describe('#getNameAccount()', function() {
    it('should return two name divided by a comma when there are two members', function() {
      var account = fixture.getAccount([
        {
          name: 'A',
          id: '10',
        },
        {
          name: 'B',
          id: '11',
        },
        {
          name: 'C',
          id: '12',
        },
        {
          name: 'D',
          id: '13',
        },
      ]);
      account = account.set('name', '');

      assert.equal(accountUtils.getNameAccount(account), 'A, B, C');
    });
  });
});
