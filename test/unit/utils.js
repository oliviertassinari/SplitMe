'use strict';

var assert = require('assert');
var fixture = require('../fixture');
var utils = require('../../src/utils');

describe('utils', function() {
  describe('#getExpenseMembers()', function() {
    it('should return members 0, 10, 11 when expense have acount A and B', function() {
      var expense = {
        accounts: [
          fixture.getAccount('A', '10'),
          fixture.getAccount('B', '11'),
        ],
      };

      var members = utils.getExpenseMembers(expense);

      assert.equal(3, members.array.length);
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

      assert.equal(4.44, utils.roundAmount(expense.accounts[0].balances[0].value));
      assert.equal(1, expense.accounts[0].expenses.length);
      assert.equal('2015-03-21', expense.accounts[0].dateLastExpense);
      assert.equal(4.44, utils.roundAmount(expense.accounts[1].balances[0].value));
      assert.equal(1, expense.accounts[1].expenses.length);
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

      assert.equal(6.66, utils.roundAmount(expense.accounts[0].balances[0].value));
      assert.equal(0, utils.roundAmount(expense.accounts[1].balances[0].value));
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

      assert.equal(-6.65, utils.roundAmount(expense.accounts[0].balances[0].value));
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

      assert.equal(12.31, utils.roundAmount(expense.accounts[0].balances[0].value));
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

      assert.equal(7.99, utils.roundAmount(expense.accounts[0].balances[0].value));
    });

    it('should update balance when we edit an expense', function() {
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
          fixture.getAccount('A', '10')
        ],
      };
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

      assert.equal(0, utils.roundAmount(expense.accounts[0].balances[0].value));
      assert.equal(0, expense.accounts[0].expenses.length);
      assert.equal('', expense.accounts[0].dateLastExpense);
      assert.equal(0, utils.roundAmount(expense.accounts[1].balances[0].value));
      assert.equal(0, expense.accounts[1].expenses.length);
      assert.equal('', expense.accounts[1].dateLastExpense);
    });
  });
});
