import {assert} from 'chai';
import Immutable from 'immutable';

import selector from './selector';
import fixture from '../fixture';

describe('delete expense', () => {
  before((done) => {
    const account = fixture.getAccount([{
      name: 'AccountName1',
      id: '10',
    }]);

    const expenses = new Immutable.List([
      fixture.getExpense({
        paidForContactIds: ['10'],
      }),
    ]);

    browser
      .url('http://0.0.0.0:8000/?locale=fr')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account.toJS(), expenses.toJS()) // node.js context
      .call(done);
  });

  it('should show account when we delete an expense', (done) => {
    browser
      .waitForExist(selector.listItem)
      .click(selector.listItem)
      .waitForExist(selector.listItem)
      .pause(400) // Wait will fetching expenses
      .elements(selector.expenseList + ' ' + selector.listItem, (err, res) => {
        assert.lengthOf(res.value, 1);
      })
      .click(selector.listItem)
      .waitForExist(selector.expenseAddSave)
      .click(selector.bottomButton) // delete
      .waitForExist(selector.modal)
      .pause(400)
      .click(selector.modal + ' button:nth-child(2)') // OK
      .waitForExist(selector.bottomButton, 1000, true) // delete
      .getText(selector.appBarTitle, (err, text) => {
        assert.equal(text, 'AccountName1');
      })
      .elements(selector.expenseList + ' ' + selector.listItem, (err, res) => {
        assert.lengthOf(res.value, 0);
      })
      .pause(100) // Wait show
      .getText(selector.snackbar, (err, text) => {
        assert.isAbove(text.length, 0, 'Snackbar message is empty');
      })
      .call(done);
  });
});
