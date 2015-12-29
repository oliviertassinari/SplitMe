import {assert} from 'chai';
import Immutable from 'immutable';

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
      .url('http://0.0.0.0:8000/?locale=fr#/accounts')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account.toJS(), expenses.toJS()) // node.js context
      .call(done);
  });

  it('should show account when we delete an expense', (done) => {
    browser
      .waitForExist('[data-test=ListItem]')
      .click('[data-test=ListItem]')
      .waitForExist('[data-test=ListItem]')
      .pause(400) // Wait will fetching expenses
      .elements('[data-test=ExpenseList] [data-test=ListItem]', (err, res) => {
        assert.lengthOf(res.value, 1);
      })
      .click('[data-test=ListItem]')
      .waitForExist('[data-test=ExpenseSave]')
      .click('[data-test=BottomButton]') // Delete
      .waitForExist('[data-test=ModalButton1]')
      .pause(400)
      .click('[data-test=ModalButton1]') // Delete
      .waitForExist('[data-test=BottomButton]', 1000, true) // Delete
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'AccountName1');
      })
      .elements('[data-test=ExpenseList] [data-test=ListItem]', (err, res) => {
        assert.lengthOf(res.value, 0);
      })
      .pause(100) // Wait show
      .getText('[data-test=Snackbar]', (err, text) => {
        assert.isAbove(text.length, 0, 'Snackbar message is empty');
      })
      .call(done);
  });
});
