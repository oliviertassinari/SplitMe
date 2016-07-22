// @flow weak

import Immutable from 'immutable';
import {assert} from 'chai';
import fixtureBrowser from './fixtureBrowser';
import fixture from './fixture';
import API from 'API';

describe('fixtureBrowser', () => {
  // runs before all tests in this block
  before((done) => {
    API.destroyAll().then(() => {
      done();
    }).catch((err) => {
      throw err;
    });
  });

  describe('#saveAccountAndExpenses()', () => {
    it('should save two expenses when we provide two expenses', (done) => {
      const account = fixture.getAccount([{
        name: 'AccountName2',
        id: '12',
      }]);

      const expenses = new Immutable.List([
        fixture.getExpense({
          paidForContactIds: ['12'],
        }),
        fixture.getExpense({
          paidForContactIds: ['12'],
          currency: 'USD',
        }),
      ]);

      fixtureBrowser.saveAccountAndExpenses(account, expenses)
        .then((accountSaved) => {
          return API.fetch(accountSaved.get('_id'));
        })
        .then((accountFetched) => {
          assert.equal(accountFetched.get('expenses').size, 2);
          assert.equal(accountFetched.getIn(['members', 0, 'balances']).size, 2);
          done();
        });
    });
  });
});
