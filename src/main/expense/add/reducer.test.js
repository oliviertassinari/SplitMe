import {assert} from 'chai';
import Immutable from 'immutable';

import {setPaidByFromAccount} from './reducer';

describe('expense add reducer', () => {
  describe('#setPaidByFromAccount', () => {
    let account;

    beforeEach(() => {
      account = Immutable.fromJS({
        members: [
          {
            id: '0',
          },
          {
            id: '1',
          },
        ],
      });
    });

    it('should clear the paid by if there is no match', () => {
      const expense = Immutable.fromJS({
        paidByContactId: '2',
      });
      const actual = setPaidByFromAccount(expense, account);

      assert.strictEqual(actual.get('paidByContactId'), null);
    });

    it('should keep the paid by if there is a match', () => {
      const expense = Immutable.fromJS({
        paidByContactId: '1',
      });
      const actual = setPaidByFromAccount(expense, account);

      assert.strictEqual(actual.get('paidByContactId'), '1');
    });
  });
});
