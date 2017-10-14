import Immutable from 'immutable';
import { assert } from 'chai';
import API from 'API';
import fixtureBrowser from './fixtureBrowser';
import fixture from './fixture';

describe('fixtureBrowser', () => {
  describe('#saveAccountAndExpenses()', () => {
    before(() => {
      return API.setUpDataBase();
    });

    after(() => {
      return API.destroyDb();
    });

    it('should save two expenses when we provide two expenses', () => {
      const account = fixture.getAccount({
        members: [
          {
            name: 'AccountName2',
            id: '12',
          },
        ],
      });

      const expenses = new Immutable.List([
        fixture.getExpense({
          paidForContactIds: ['12'],
        }),
        fixture.getExpense({
          paidForContactIds: ['12'],
          currency: 'USD',
        }),
      ]);

      return fixtureBrowser
        .saveAccountAndExpenses(account, expenses)
        .then(accountSaved => {
          return API.fetch(accountSaved.get('_id'));
        })
        .then(accountFetched => {
          assert.strictEqual(accountFetched.get('expenses').size, 2);
          assert.strictEqual(accountFetched.getIn(['members', 0, 'balances']).size, 2);
        });
    });
  });
});
