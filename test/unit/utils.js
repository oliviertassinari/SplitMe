'use strict';

var assert = require('chai').assert;
var fixture = require('../fixture');
var utils = require('../../src/utils');

function roundAmount(amount) {
  return Math.round(100 * amount) / 100;
}

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
      assert.equal(A.members[0], members.array[0]); // Me
      assert.equal(A.members[1], members.array[1]);
      assert.equal(B.members[1], members.array[2]);
    });
  });

  describe('#getExpenseAccountsBalances()', function() {
    it('should have the balances empty when expenses is invalide', function() {
      var expense = {
        amount: 13.31,
        currency: 'EUR',
        type: 'individual',
        date: '2015-03-21',
        paidByContactId: '0',
        split: 'equaly',
        paidFor: [
          {
            contactId: '0',
            split_equaly: false,
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
      var balances = utils.getExpenseAccountsBalances(expense);
      assert.lengthOf(balances, 0);

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
      balances = utils.getExpenseAccountsBalances(expense);
      assert.lengthOf(balances, 0);

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
      balances = utils.getExpenseAccountsBalances(expense);
      assert.lengthOf(balances, 0);
    });
  });

  describe('#applyExpenseToAccounts()', function() {
    it('should have balance when id 0 paid equaly for 0, 10 and 11', function() {
      var expense = {
        amount: 13.31,
        currency: 'EUR',
        type: 'individual',
        date: '2015-03-21',
        paidByContactId: '0',
        split: 'equaly',
        paidFor: [
          {
            contactId: '0',
            split_equaly: true,
          },
          {
            contactId: '10',
            split_equaly: true,
          },
          {
            contactId: '11',
            split_equaly: true,
          },
        ],
        accounts: [
          fixture.getAccount('A', '10'),
          fixture.getAccount('B', '11')
        ],
      };

      utils.applyExpenseToAccounts(expense);

      assert.equal(4.44, roundAmount(expense.accounts[0].balances[0].value));
      assert.lengthOf(expense.accounts[0].expenses, 1);
      assert.equal('2015-03-21', expense.accounts[0].dateLastExpense);
      assert.equal(4.44, roundAmount(expense.accounts[1].balances[0].value));
      assert.lengthOf(expense.accounts[1].expenses, 1);
      assert.equal('2015-03-21', expense.accounts[1].dateLastExpense);
    });

    it('should have balance when id 0 paid equaly for 0, 10 and not 11', function() {
      var expense = {
        amount: 13.31,
        currency: 'EUR',
        type: 'individual',
        paidByContactId: '0',
        date: '2015-03-21',
        split: 'equaly',
        paidFor: [
          {
            contactId: '0',
            split_equaly: true,
          },
          {
            contactId: '10',
            split_equaly: true,
          },
          {
            contactId: '11',
            split_equaly: false,
          },
        ],
        accounts: [
          fixture.getAccount('A', '10'),
          fixture.getAccount('B', '11')
        ],
      };

      utils.applyExpenseToAccounts(expense);

      assert.equal(6.66, roundAmount(expense.accounts[0].balances[0].value));
      assert.equal(0, roundAmount(expense.accounts[1].balances[0].value));
      assert.equal(null, expense.accounts[1].dateLastExpense);
    });

    it('should have balance when id 10 paid equaly for 0, 10', function() {
      var expense = {
        amount: 13.31,
        currency: 'EUR',
        type: 'individual',
        paidByContactId: '10',
        date: '2015-03-21',
        split: 'equaly',
        paidFor: [
          {
            contactId: '0',
            split_equaly: true,
          },
          {
            contactId: '10',
            split_equaly: true,
          },
        ],
        accounts: [
          fixture.getAccount('A', '10')
        ],
      };

      utils.applyExpenseToAccounts(expense);

      assert.equal(-6.65, roundAmount(expense.accounts[0].balances[0].value));
    });

    it('should have balance when id 0 paid unequaly for 0, 10', function() {
      var expense = {
        amount: 13.31,
        currency: 'EUR',
        type: 'individual',
        paidByContactId: '0',
        date: '2015-03-21',
        split: 'unequaly',
        paidFor: [
          {
            contactId: '0',
            split_unequaly: 1,
          },
          {
            contactId: '10',
            split_unequaly: 12.31,
          },
        ],
        accounts: [
          fixture.getAccount('A', '10')
        ],
      };

      utils.applyExpenseToAccounts(expense);

      assert.equal(12.31, roundAmount(expense.accounts[0].balances[0].value));
    });

    it('should have balance when id 0 paid shares for 0, 10', function() {
      var expense = {
        amount: 13.31,
        currency: 'EUR',
        type: 'individual',
        paidByContactId: '0',
        date: '2015-03-21',
        split: 'shares',
        paidFor: [
          {
            contactId: '0',
            split_shares: 2,
          },
          {
            contactId: '10',
            split_shares: 3,
          },
        ],
        accounts: [
          fixture.getAccount('A', '10'),
          fixture.getAccount('B', '11')
        ],
      };

      utils.applyExpenseToAccounts(expense);

      assert.equal(7.99, roundAmount(expense.accounts[0].balances[0].value));
    });
  });

  describe('#removeExpenseOfAccounts()', function() {
    it('should have balance when remove expense', function() {
      var expense = {
        amount: 13.31,
        currency: 'EUR',
        type: 'individual',
        date: '2015-03-21',
        paidByContactId: '0',
        split: 'equaly',
        paidFor: [
          {
            contactId: '0',
            split_equaly: true,
          },
          {
            contactId: '10',
            split_equaly: true,
          },
          {
            contactId: '11',
            split_equaly: true,
          },
        ],
        accounts: [
          fixture.getAccount('A', '10'),
          fixture.getAccount('B', '11')
        ],
      };

      utils.applyExpenseToAccounts(expense);
      utils.removeExpenseOfAccounts(expense);

      assert.equal(0, roundAmount(expense.accounts[0].balances[0].value));
      assert.lengthOf(expense.accounts[0].expenses, 0);
      assert.equal('', expense.accounts[0].dateLastExpense);
      assert.equal(0, roundAmount(expense.accounts[1].balances[0].value));
      assert.lengthOf(expense.accounts[1].expenses, 0);
      assert.equal('', expense.accounts[1].dateLastExpense);
    });
  });

  describe('#getTransfersForSettlingBalance()', function() {
    it('should optimal transfers when there are a simple balances', function() {
      var balance = [
        {
          memberId: 0,
          value: 20
        },
        {
          memberId: 1,
          value: 0
        },
        {
          memberId: 2,
          value: -20
        }];

      var transfers = utils.getTransfersForSettlingBalance(balance);

      assert.lengthOf(transfers, 0);
    });
  });
});
