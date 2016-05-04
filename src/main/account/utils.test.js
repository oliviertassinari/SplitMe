import Immutable from 'immutable';
import {assert} from 'chai';
import path from 'path';
require('app-module-path').addPath(path.join(__dirname, '../../'));

import fixture from '../../../test/fixture';
import accountUtils from 'main/account/utils';

describe('account utils', () => {
  describe('#addExpenseToAccount()', () => {
    it('should have updated accounts when adding an expense', () => {
      let account = fixture.getAccount([
        {
          name: 'A',
          id: '10',
        },
        {
          name: 'B',
          id: '11',
        },
      ]);

      const expense = fixture.getExpenseEqualy1();
      account = accountUtils.addExpenseToAccount(expense, account);

      assert.closeTo(account.getIn(['members', 0, 'balances', 0, 'value']), 8.87, 0.01);
      assert.closeTo(account.getIn(['members', 1, 'balances', 0, 'value']), -4.44, 0.01);
      assert.closeTo(account.getIn(['members', 2, 'balances', 0, 'value']), -4.44, 0.01);
      assert.strictEqual(account.get('expenses').size, 1);
      assert.strictEqual(account.get('dateLatestExpense'), '2015-03-21');
    });

    it('should have dateLatestExpense correct when adding an second expense', () => {
      let account = fixture.getAccount([
        {
          name: 'A',
          id: '10',
        },
        {
          name: 'B',
          id: '11',
        },
      ]);

      const expense1 = fixture.getExpense({
        date: '2015-03-21',
        paidForContactIds: ['10', '11'],
      });
      account = accountUtils.addExpenseToAccount(expense1, account);

      const expense2 = fixture.getExpense({
        date: '2015-03-20',
        paidForContactIds: ['10', '11'],
      });
      account = accountUtils.addExpenseToAccount(expense2, account);

      assert.strictEqual(account.get('dateLatestExpense'), '2015-03-21');
    });
  });

  describe('#removeExpenseOfAccount()', () => {
    it('should have remove account\'s balance when removing the only one expense', () => {
      const expense = fixture.getExpenseEqualy1();
      let account = fixture.getAccount([
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

      assert.strictEqual(account.getIn(['members', 0, 'balances']).size, 0);
      assert.strictEqual(account.getIn(['members', 1, 'balances']).size, 0);
      assert.strictEqual(account.getIn(['members', 2, 'balances']).size, 0);
      assert.strictEqual(account.get('expenses').size, 0);
      assert.strictEqual(account.get('dateLatestExpense'), null);
    });

    it('should have updated account\'s balance when removing an expense in USD', () => {
      const expense1 = fixture.getExpenseEqualy1();
      const expense2 = fixture.getExpense({
        currency: 'USD',
        paidForContactIds: ['10', '11'],
        date: '2015-03-23',
      });
      let account = fixture.getAccount([
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
      assert.strictEqual(account.get('dateLatestExpense'), '2015-03-23');

      account = accountUtils.removeExpenseOfAccount(expense2, account);
      assert.strictEqual(account.getIn(['members', 0, 'balances']).size, 1);
      assert.closeTo(account.getIn(['members', 0, 'balances', 0, 'value']), 8.87, 0.01);
      assert.strictEqual(account.getIn(['members', 1, 'balances']).size, 1);
      assert.closeTo(account.getIn(['members', 1, 'balances', 0, 'value']), -4.44, 0.01);
      assert.strictEqual(account.getIn(['members', 2, 'balances']).size, 1);
      assert.closeTo(account.getIn(['members', 2, 'balances', 0, 'value']), -4.44, 0.01);
      assert.strictEqual(account.getIn(['expenses']).size, 1);
      assert.strictEqual(account.get('dateLatestExpense'), '2015-03-21');
    });
  });

  describe('#getTransfersForSettlingMembers()', () => {
    it('should optimal transfers when there are members settled', () => {
      const members = Immutable.fromJS([
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

      const transfers = accountUtils.getTransfersForSettlingMembers(members, 'EUR');
      assert.strictEqual(transfers.length, 0);
    });

    it('should have optimal transfers when in a simple case', () => {
      const members = Immutable.fromJS([
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

      const transfers = accountUtils.getTransfersForSettlingMembers(members, 'EUR');
      assert.strictEqual(transfers.length, 1);
      assert.strictEqual(transfers[0].from.get('id'), '2');
      assert.strictEqual(transfers[0].to.get('id'), '0');
      assert.strictEqual(transfers[0].amount, 20);
      assert.strictEqual(transfers[0].currency, 'EUR');
    });

    it('should have optimal transfers when in a complexe case', () => {
      const members = fixture.getMembersWhereBalanceComplexe();

      const transfers = accountUtils.getTransfersForSettlingMembers(members, 'EUR');
      assert.strictEqual(transfers.length, 3);
      assert.strictEqual(transfers[0].from.get('id'), '2');
      assert.strictEqual(transfers[0].to.get('id'), '3');
      assert.strictEqual(transfers[0].amount, 30);

      assert.strictEqual(transfers[1].from.get('id'), '2');
      assert.strictEqual(transfers[1].to.get('id'), '1');
      assert.strictEqual(transfers[1].amount, 20);

      assert.strictEqual(transfers[2].from.get('id'), '0');
      assert.strictEqual(transfers[2].to.get('id'), '1');
      assert.strictEqual(transfers[2].amount, 10);
    });
  });

  describe('#getCurrenciesWithMembers()', () => {
    it('should return currencies of balacnes of members when there are balances', () => {
      const members = fixture.getMembersWhereBalanceComplexe();
      const currencies = accountUtils.getCurrenciesWithMembers(members);

      assert.sameMembers(currencies, ['USD', 'EUR']);
    });
  });

  describe('#getNameAccount()', () => {
    it('should return two name divided by a comma when there are two members', () => {
      let account = fixture.getAccount([
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

      assert.strictEqual(accountUtils.getNameAccount(account), 'A, B, C');
    });
  });
});
