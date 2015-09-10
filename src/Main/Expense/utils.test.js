'use strict';

const Immutable = require('immutable');
const assert = require('chai').assert;
const path = require('path');
require('app-module-path').addPath(path.join(__dirname, '../../'));

const fixture = require('../../../test/fixture');
const expenseUtils = require('Main/Expense/utils');

describe('expense utils', function() {
  describe('#getTransfersDueToAnExpense()', function() {
    it('should return empty transfers when expenses are invalide', function() {
      let expense = Immutable.fromJS({
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

      let transfers = expenseUtils.getTransfersDueToAnExpense(expense);
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

      transfers = expenseUtils.getTransfersDueToAnExpense(expense);
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
      transfers = expenseUtils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 0);
    });

    it('should return good transfers when id 0 paid equaly for 0, 10 and 11', function() {
      const expense = fixture.getExpenseEqualy1();

      const transfers = expenseUtils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 2);
      assert.equal(transfers[0].from, '0');
      assert.equal(transfers[0].to, '10');
      assert.closeTo(transfers[0].amount, 4.44, 0.01);

      assert.equal(transfers[1].from, '0');
      assert.equal(transfers[1].to, '11');
      assert.closeTo(transfers[1].amount, 4.44, 0.01);
    });

    it('should return good transfers when id 0 paid equaly for 0, 10 and not 11', function() {
      const expense = fixture.getExpenseEqualy2();

      const transfers = expenseUtils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 1);
      assert.equal(transfers[0].from, '0');
      assert.equal(transfers[0].to, '10');
      assert.closeTo(transfers[0].amount, 6.66, 0.01);
    });

    it('should return good transfers when id 0 paid unequaly for 0, 10', function() {
      const expense = fixture.getExpenseUnequaly();

      const transfers = expenseUtils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 1);
      assert.equal(transfers[0].from, '0');
      assert.equal(transfers[0].to, '10');
      assert.closeTo(transfers[0].amount, 12.31, 0.01);
    });

    it('should return good transfers when id 0 paid shares for 0, 10', function() {
      const expense = fixture.getExpenseShares();

      const transfers = expenseUtils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 1);
      assert.equal(transfers[0].from, '0');
      assert.equal(transfers[0].to, '10');
      assert.closeTo(transfers[0].amount, 7.99, 0.01);
    });
  });
});
