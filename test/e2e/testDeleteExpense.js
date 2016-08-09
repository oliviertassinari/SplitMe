// @flow weak

import {assert} from 'chai';
import Immutable from 'immutable';
import fixture from '../fixture';

const account = fixture.getAccount([{
  name: 'AccountName1',
  id: '10',
}]);

const expenses = new Immutable.List([
  fixture.getExpense({
    paidForContactIds: ['10'],
  }),
]);

describe('delete expense', () => {
  before(() => {
    return global.browser
      .timeouts('script', 5000);
  });

  describe('delete', () => {
    it('should show account when we delete an expense', () => {
      return global.browser
        .url('http://local.splitme.net:8000/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account.toJS(), expenses.toJS()) // node.js context
        .waitForExist('[data-test="ListItem"]')
        .click('[data-test="ListItem"]')
        .waitForExist('[data-test="ListItem"]')
        .pause(400) // Wait will fetching expenses
        .elements('[data-test="ExpenseList"] [data-test="ListItem"]', (err, res) => {
          assert.strictEqual(res.value.length, 1);
        })
        .click('[data-test="ListItem"]')
        .waitForExist('[data-test="ExpenseSave"]')
        .click('[data-test=BottomButton]') // Delete
        .waitForExist('[data-test="ModalButton1"]')
        .pause(400)
        .click('[data-test="ModalButton1"]') // Delete
        .waitForExist('[data-test=BottomButton]', 5000, true) // Delete
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'AccountName1');
        })
        .elements('[data-test="ExpenseList"] [data-test="ListItem"]', (err, res) => {
          assert.strictEqual(res.value.length, 0);
        })
        .pause(100) // Wait show
        .getText('[data-test="Snackbar"]')
        .then((text) => {
          assert.strictEqual(text.length > 0, true, 'Should display a confirmation.');
        })
        .back()
        .getText('[data-test="ListItemBodyRight"]')
        .then((text) => {
          assert.strictEqual(text, "à l'équilibre");
        });
    });
  });
});
