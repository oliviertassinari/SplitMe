'use strict';

var assert = require('chai').assert;
var fixture = require('../fixture');
var utils = require('../../src/utils');

describe('utils', function() {
  describe('#getExpenseMembers()', function() {
    it('should return members 0, 10, 11 when expense have acount A and B', function() {
      var A = fixture.getAccount('A', '10');
      var B = fixture.getAccount('B', '11');

      var expense = {
        accounts: [
          A,
          B,
        ],
      };

      var members = utils.getExpenseMembers(expense);

      assert.lengthOf(members.array, 3);
      assert.equal(members.array[0], A.members[0]); // Me
      assert.equal(members.array[1], A.members[1]);
      assert.equal(members.array[2], B.members[1]);
    });
  });

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
        accounts: [
          fixture.getAccount('A', '10'),
        ],
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

      utils.addExpenseToAccounts(expense);

      var transfers = utils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 1);
      assert.equal(transfers[0].from, '0');
      assert.equal(transfers[0].to, '10');
      assert.closeTo(transfers[0].amount, 12.31, 0.01);
    });

    it('should return good transfers when id 0 paid shares for 0, 10', function() {
      var expense = fixture.getExpenseShares();

      utils.addExpenseToAccounts(expense);

      var transfers = utils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 1);
      assert.equal(transfers[0].from, '0');
      assert.equal(transfers[0].to, '10');
      assert.closeTo(transfers[0].amount, 7.99, 0.01);
    });
  });

  describe('#addExpenseToAccounts()', function() {
    it('should have updated accounts when adding an expense', function() {
      var expense = fixture.getExpenseEqualy1();

      utils.addExpenseToAccounts(expense);

      assert.closeTo(expense.accounts[0].members[0].balances[0].value, 4.44, 0.01);
      assert.closeTo(expense.accounts[0].members[1].balances[0].value, -4.44, 0.01);
      assert.lengthOf(expense.accounts[0].expenses, 1);
      assert.equal(expense.accounts[0].dateLastExpense, '2015-03-21');

      assert.closeTo(expense.accounts[1].members[0].balances[0].value, 4.44, 0.01);
      assert.closeTo(expense.accounts[1].members[1].balances[0].value, -4.44, 0.01);
      assert.lengthOf(expense.accounts[1].expenses, 1);
      assert.equal(expense.accounts[1].dateLastExpense, '2015-03-21');
    });
  });

  describe('#removeExpenseOfAccounts()', function() {
    it('should have updated accounts when removing an expense', function() {
      var expense = fixture.getExpenseEqualy1();

      utils.addExpenseToAccounts(expense);
      utils.removeExpenseOfAccounts(expense);

      assert.closeTo(expense.accounts[0].members[0].balances[0].value, 0, 0.01);
      assert.closeTo(expense.accounts[0].members[1].balances[0].value, 0, 0.01);
      assert.lengthOf(expense.accounts[0].expenses, 0);
      assert.equal(expense.accounts[0].dateLastExpense, null);

      assert.closeTo(expense.accounts[1].members[0].balances[0].value, 0, 0.01);
      assert.closeTo(expense.accounts[1].members[1].balances[0].value, 0, 0.01);
      assert.lengthOf(expense.accounts[1].expenses, 0);
      assert.equal(expense.accounts[1].dateLastExpense, null);
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
      assert.deepEqual(transfers, [{
        from: '2',
        to: '0',
        amount: 20
      }]);
    });

    it('should have optimal transfers when in a complexe case', function() {
      var members = [
        {
          id: '0',
          balances: [{
            currency: 'EUR',
            value: -10
          }]
        },
        {
          id: '1',
          balances: [{
            currency: 'EUR',
            value: 30
          }]
        },
        {
          id: '2',
          balances: [{
            currency: 'EUR',
            value: -50
          }]
        },
        {
          id: '3',
          balances: [{
            currency: 'EUR',
            value: 30
          }]
        }
      ];

      var transfers = utils.getTransfersForSettlingMembers(members, 'EUR');
      assert.deepEqual(transfers, [{
        from: '2',
        to: '3',
        amount: 30
      },{
        from: '2',
        to: '1',
        amount: 20
      },{
        from: '0',
        to: '1',
        amount: 10
      }]);
    });
  });
});
