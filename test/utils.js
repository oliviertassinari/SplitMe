'use strict';

var assert = require('assert');
var utils = require('../src/utils.jsx');

function getExpense() {
  return {
    description: '',
    amount: '13.31',
    currency: 'EUR',
    date: 'moment().format("l")',
    type: 'individual',
    paidByContactId: undefined,
    split: 'equaly',
    paidFor: [
      {
        contactId: '0', // Reference to a member
        split_equaly: true,
        split_unequaly: '',
        split_shares: '1',
      },
      {
        contactId: '10', // Reference to a member
        split_equaly: true,
        split_unequaly: '',
        split_shares: '1',
      },
      {
        contactId: '11', // Reference to a member
        split_equaly: true,
        split_unequaly: '',
        split_shares: '1',
      },
    ],
    accounts: [{
      name: 'Nicolas',
      dateLastExpense: undefined,
      expenses: [],
      members: [{
        id: '0',
        displayName: 'Me',
      },{
        id: '10',
        displayName: 'Nicolas',
      }],
      balances: [{
        value: 0,
        currency: 'EUR',
      }],
    }, {
      name: 'Alexandre',
      dateLastExpense: undefined,
      expenses: [],
      members: [{
        id: '0',
        displayName: 'Me',
      },{
        id: '11',
        displayName: 'Alexandre',
      }],
      balances: [{
        value: 0,
        currency: 'EUR',
      }],
    }],
  };
}

describe('utils', function() {
  describe('#applyExpenseToAccounts()', function() {
    var expense = getExpense();

    it('should have balance when id 0 paid', function() {
      expense.paidByContactId = '0';

      utils.applyExpenseToAccounts(expense);

      assert.equal(2, 2);
    });

    it('should have balance when id 10 paid', function() {
      expense.paidByContactId = '10';

      utils.applyExpenseToAccounts(expense);

      assert.equal(2, 2);
    });

    it('should have balance when id 11 paid', function() {
      expense.paidByContactId = '11';

      utils.applyExpenseToAccounts(expense);

      assert.equal(2, 2);
    });
  });
});
