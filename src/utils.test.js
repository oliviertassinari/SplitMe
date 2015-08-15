'use strict';

var Immutable = require('immutable');
var assert = require('chai').assert;
var path = require('path');
require('app-module-path').addPath(path.join(__dirname, ''));

var fixture = require('../test/fixture');
var utils = require('utils');

describe('utils', function() {
  describe('#getTransfersDueToAnExpense()', function() {
    it('should return empty transfers when expenses are invalide', function() {
      var expense = Immutable.fromJS({
        amount: 13.31,
        currency: 'EUR',
        paidByContactId: '0',
        split: 'equaly',
        paidFor: [
          {
            contactId: '0',
            split_equaly: true,
          },
          {
            contactId: '10',
            split_equaly: false,
          },
        ],
      });

      var transfers = utils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 0);

      expense = expense.set('split', 'unequaly');
      expense = expense.set('paidFor', Immutable.fromJS([
        {
          contactId: '0',
          split_unequaly: null,
        },
        {
          contactId: '10',
          split_unequaly: null,
        },
      ]));

      transfers = utils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 0);

      expense = expense.set('split', 'shares');
      expense = expense.set('paidFor', Immutable.fromJS([
        {
          contactId: '0',
          split_shares: null,
        },
        {
          contactId: '10',
          split_shares: null,
        },
      ]));
      transfers = utils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 0);
    });

    it('should return good transfers when id 0 paid equaly for 0, 10 and 11', function() {
      var expense = fixture.getExpenseEqualy1();

      var transfers = utils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 2);
      assert.equal(transfers[0].from, '0');
      assert.equal(transfers[0].to, '10');
      assert.closeTo(transfers[0].amount, 4.44, 0.01);

      assert.equal(transfers[1].from, '0');
      assert.equal(transfers[1].to, '11');
      assert.closeTo(transfers[1].amount, 4.44, 0.01);
    });

    it('should return good transfers when id 0 paid equaly for 0, 10 and not 11', function() {
      var expense = fixture.getExpenseEqualy2();

      var transfers = utils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 1);
      assert.equal(transfers[0].from, '0');
      assert.equal(transfers[0].to, '10');
      assert.closeTo(transfers[0].amount, 6.66, 0.01);
    });

    it('should return good transfers when id 0 paid unequaly for 0, 10', function() {
      var expense = fixture.getExpenseUnequaly();

      var transfers = utils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 1);
      assert.equal(transfers[0].from, '0');
      assert.equal(transfers[0].to, '10');
      assert.closeTo(transfers[0].amount, 12.31, 0.01);
    });

    it('should return good transfers when id 0 paid shares for 0, 10', function() {
      var expense = fixture.getExpenseShares();

      var transfers = utils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 1);
      assert.equal(transfers[0].from, '0');
      assert.equal(transfers[0].to, '10');
      assert.closeTo(transfers[0].amount, 7.99, 0.01);
    });
  });

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

      account = utils.addExpenseToAccount(expense, account);

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

      account = utils.addExpenseToAccount(expense, account);
      account = utils.removeExpenseOfAccount(expense, account);

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

      account = utils.addExpenseToAccount(expense1, account);
      account = utils.addExpenseToAccount(expense2, account);
      account = utils.removeExpenseOfAccount(expense2, account);

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

      var transfers = utils.getTransfersForSettlingMembers(members, 'EUR');
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

      var transfers = utils.getTransfersForSettlingMembers(members, 'EUR');
      assert.lengthOf(transfers, 1);
      assert.equal(transfers[0].from.get('id'), '2');
      assert.equal(transfers[0].to.get('id'), '0');
      assert.equal(transfers[0].amount, 20);
      assert.equal(transfers[0].currency, 'EUR');
    });

    it('should have optimal transfers when in a complexe case', function() {
      var members = fixture.getMembersWhereBalanceComplexe();

      var transfers = utils.getTransfersForSettlingMembers(members, 'EUR');
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
      var currencies = utils.getCurrenciesWithMembers(members);

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

      assert.equal(utils.getNameAccount(account), 'A, B, C');
    });
  });
});
