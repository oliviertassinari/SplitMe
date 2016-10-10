// @flow weak
/* eslint-env mocha */

import Immutable from 'immutable';
import { assert } from 'chai';
import API from 'API';
import fixtureBrowser from './fixtureBrowser';
import fixture from './fixture';

describe('fixtureBrowser', () => {
  describe('#saveAccountAndExpenses()', () => {
    before(() => {
      return API.destroyAll();
    });

    it('should save two expenses when we provide two expenses', () => {
      const account = fixture.getAccount({
        members: [{
          name: 'AccountName2',
          id: '12',
        }],
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

      return fixtureBrowser.saveAccountAndExpenses(account, expenses)
        .then((accountSaved) => {
          return API.fetch(accountSaved.get('_id'));
        })
        .then((accountFetched) => {
          assert.equal(accountFetched.get('expenses').size, 2);
          assert.equal(accountFetched.getIn(['members', 0, 'balances']).size, 2);
        });
    });
  });
});
