'use strict';

var path = require('path');
require('app-module-path').addPath(path.join(__dirname, ''));

var assert = require('chai').assert;
var fixture = require('../test/fixture');
var utils = require('utils');

describe('utils', function() {
  describe('#getTransfersDueToAnExpense()', function() {
    it('should return empty transfers when expenses are invalide', function() {
      var expense = {
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
        account: fixture.getAccount([{
          name: 'A',
          id: '10'
        }]),
      };
      var transfers = utils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 0);

      expense.split = 'unequaly';
      expense.paidFor = [
        {
          contactId: '0',
          split_unequaly: null,
        },
        {
          contactId: '10',
          split_unequaly: null,
        },
      ];
      transfers = utils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 0);

      expense.split = 'shares';
      expense.paidFor = [
        {
          contactId: '0',
          split_shares: null,
        },
        {
          contactId: '10',
          split_shares: null,
        },
      ];
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

      utils.addExpenseToAccount(expense);

      assert.closeTo(expense.account.members[0].balances[0].value, 8.87, 0.01);
      assert.closeTo(expense.account.members[1].balances[0].value, -4.44, 0.01);
      assert.closeTo(expense.account.members[2].balances[0].value, -4.44, 0.01);
      assert.lengthOf(expense.account.expenses, 1);
      assert.equal(expense.account.dateLastExpense, '2015-03-21');
    });
  });

  describe('#removeExpenseOfAccount()', function() {
    it('should have remove account\'s balance when removing the only one expense', function() {
      var expense = fixture.getExpenseEqualy1();
      var account = expense.account;

      utils.addExpenseToAccount(expense);
      utils.removeExpenseOfAccount(expense);

      assert.lengthOf(account.members[0].balances, 0);
      assert.lengthOf(account.members[1].balances, 0);
      assert.lengthOf(account.members[2].balances, 0);
      assert.lengthOf(account.expenses, 0);
      assert.equal(account.dateLastExpense, null);
    });

    it('should have updated account\'s balance when removing an expense in USD', function() {
      var expense1 = fixture.getExpenseEqualy1();
      var account = expense1.account;
      var expense2 = fixture.getExpense({
        currency: 'USD',
        contactIds: ['10', '11'],
      });
      expense2.account = account;

      utils.addExpenseToAccount(expense1);
      utils.addExpenseToAccount(expense2);
      utils.removeExpenseOfAccount(expense2);

      assert.lengthOf(account.members[0].balances, 1);
      assert.closeTo(account.members[0].balances[0].value, 8.87, 0.01);
      assert.lengthOf(account.members[1].balances, 1);
      assert.closeTo(account.members[1].balances[0].value, -4.44, 0.01);
      assert.lengthOf(account.members[2].balances, 1);
      assert.closeTo(account.members[2].balances[0].value, -4.44, 0.01);
      assert.lengthOf(account.expenses, 1);
      assert.equal(account.dateLastExpense, '2015-03-21');
    });
  });

  describe('#getTransfersForSettlingMembers()', function() {
    it('should optimal transfers when there are members settled', function() {
      var members = [
        {
          id: '0',
          balances: [{
            currency: 'EUR',
            value: 0
          }]
        },
        {
          id: '1',
          balances: [{
            currency: 'EUR',
            value: 0
          }]
        },
        {
          id: '2',
          balances: [{
            currency: 'EUR',
            value: 0
          }]
        }
      ];

      var transfers = utils.getTransfersForSettlingMembers(members, 'EUR');
      assert.lengthOf(transfers, 0);
    });

    it('should have optimal transfers when in a simple case', function() {
      var members = [
        {
          id: '0',
          balances: [{
            currency: 'EUR',
            value: 20
          }]
        },
        {
          id: '1',
          balances: [{
            currency: 'EUR',
            value: 0
          }]
        },
        {
          id: '2',
          balances: [{
            currency: 'EUR',
            value: -20
          }]
        }
      ];

      var transfers = utils.getTransfersForSettlingMembers(members, 'EUR');
      assert.lengthOf(transfers, 1);
      assert.equal(transfers[0].from.id, '2');
      assert.equal(transfers[0].to.id, '0');
      assert.equal(transfers[0].amount, 20);
      assert.equal(transfers[0].currency, 'EUR');
    });

    it('should have optimal transfers when in a complexe case', function() {
      var members = fixture.getMembersWhereBalanceComplexe();

      var transfers = utils.getTransfersForSettlingMembers(members, 'EUR');
      assert.lengthOf(transfers, 3);
      assert.equal(transfers[0].from.id, '2');
      assert.equal(transfers[0].to.id, '3');
      assert.equal(transfers[0].amount, 30);

      assert.equal(transfers[1].from.id, '2');
      assert.equal(transfers[1].to.id, '1');
      assert.equal(transfers[1].amount, 20);

      assert.equal(transfers[2].from.id, '0');
      assert.equal(transfers[2].to.id, '1');
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
          id: '10'
        },
        {
          name: 'B',
          id: '11'
        },
        {
          name: 'C',
          id: '12'
        },
        {
          name: 'D',
          id: '13'
        },
      ]);
      account.name = '';

      assert.equal(utils.getNameAccount(account), 'A, B, C');
    });
  });
});
