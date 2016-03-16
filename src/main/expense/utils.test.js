import Immutable from 'immutable';
import {assert} from 'chai';
import path from 'path';
require('app-module-path').addPath(path.join(__dirname, '../../'));

import fixture from '../../../test/fixture';
import expenseUtils from 'main/expense/utils';

describe('expense utils', () => {
  describe('#getTransfersDueToAnExpense()', () => {
    it('should return empty transfers when expenses are invalide', () => {
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

    it('should return good transfers when id 0 paid equaly for 0, 10 and 11', () => {
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

    it('should return good transfers when id 0 paid equaly for 0, 10 and not 11', () => {
      const expense = fixture.getExpenseEqualy2();

      const transfers = expenseUtils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 1);
      assert.equal(transfers[0].from, '0');
      assert.equal(transfers[0].to, '10');
      assert.closeTo(transfers[0].amount, 6.66, 0.01);
    });

    it('should return good transfers when id 0 paid unequaly for 0, 10', () => {
      const expense = fixture.getExpenseUnequaly();

      const transfers = expenseUtils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 1);
      assert.equal(transfers[0].from, '0');
      assert.equal(transfers[0].to, '10');
      assert.closeTo(transfers[0].amount, 12.31, 0.01);
    });

    it('should return good transfers when id 0 paid shares for 0, 10', () => {
      const expense = fixture.getExpenseShares();

      const transfers = expenseUtils.getTransfersDueToAnExpense(expense);
      assert.lengthOf(transfers, 1);
      assert.equal(transfers[0].from, '0');
      assert.equal(transfers[0].to, '10');
      assert.closeTo(transfers[0].amount, 7.99, 0.01);
    });
  });

  describe('#isValid()', () => {
    it('should return status false when missing amount', () => {
      const expense = Immutable.fromJS({
        amount: 0,
      });

      assert.isFalse(expenseUtils.isValid(expense).status, 'This expense is invalid');
    });

    it('should return status false when missing paid by', () => {
      const expense = Immutable.fromJS({
        amount: 10,
        paidByContactId: null,
      });

      assert.isFalse(expenseUtils.isValid(expense).status, 'This expense is invalid');
    });

    it('should return status false when wrong unequaly amount', () => {
      let expense = fixture.getExpenseUnequaly();
      expense = expense.setIn(['paidFor', 0, 'split_unequaly'], 2);

      assert.isFalse(expenseUtils.isValid(expense).status, 'This expense is invalid');
    });

    it('should return status true when good unequaly amount', () => {
      const expense = fixture.getExpenseUnequaly();

      assert.isTrue(expenseUtils.isValid(expense).status, 'This expense is valid');
    });
  });
});
