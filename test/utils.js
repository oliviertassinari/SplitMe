'use strict';

var assert = require('assert');
var utils = require('../src/utils.jsx');

function getAccountA() {
  return {
    name: 'A',
    dateLastExpense: undefined,
    expenses: [],
    members: [{
      id: '0',
      displayName: 'Me',
    },{
      id: '10',
      displayName: 'A',
    }],
    balances: [{
      value: 0,
      currency: 'EUR',
    }],
  };
}

function getAccountB() {
  return {
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
  };
}

describe('utils', function() {
  describe('#applyExpenseToAccounts()', function() {

    it('should have balance when id 0 paid equaly for 0, 10 and 11', function() {
      var expense = {
        description: '',
        amount: 13.31,
        currency: 'EUR',
        date: 'moment().format("l")',
        type: 'individual',
        paidByContactId: '0',
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
        accounts: [getAccountA(), getAccountB()],
      };

      utils.applyExpenseToAccounts(expense);

      assert.equal(4.44, utils.roundAmount(expense.accounts[0].balances[0].value));
      assert.equal(4.44, utils.roundAmount(expense.accounts[1].balances[0].value));
    });

    it('should have balance when id 10 paid equaly for 0, 10', function() {
      var expense = {
        description: '',
        amount: 13.31,
        currency: 'EUR',
        date: 'moment().format("l")',
        type: 'individual',
        paidByContactId: '10',
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
        ],
        accounts: [getAccountA()],
      };

      utils.applyExpenseToAccounts(expense);

      assert.equal(-6.65, utils.roundAmount(expense.accounts[0].balances[0].value));
    });
  });
});
