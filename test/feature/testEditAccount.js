import {assert} from 'chai';
import Immutable from 'immutable';

import selector from './selector';
import fixture from '../fixture';

describe('edit account', () => {
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

  it('should show edit account when we tap on the settings button', (done) => {
    browser
      .waitForExist(selector.listItem)
      .click(selector.listItem)
      .waitForExist(selector.accountDetailMore)
      .click(selector.accountDetailMore)
      .waitForExist(selector.accountDetailSettings)
      .click(selector.accountDetailSettings)
      .waitForExist(selector.accountAddSave)
      .call(done);
  });

  it('should show detail when we tap on close account edit', (done) => {
    browser
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.accountAddSave, 1000, true)
      .getText(selector.appBarTitle, (err, text) => {
        assert.equal(text, 'AccountName1');
      })
      .call(done);
  });

  it('should update the name of the account when enter an new name', (done) => {
    const newName = 'This is a new name';

    browser
      .click(selector.accountDetailMore)
      .waitForExist(selector.accountDetailSettings)
      .click(selector.accountDetailSettings)
      .waitForExist(selector.accountAddName)
      .setValue(selector.accountAddName, newName)
      .click(selector.accountAddSave)
      .waitForExist(selector.accountAddSave, 1000, true)
      .getText(selector.appBarTitle, (err, text) => {
        assert.equal(text, newName);
      })
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.accountListMore) // Home
      .getText(selector.listItemBody + ' span', (err, text) => {
        assert.equal(text, newName);
      })
      .call(done);
  });

  it('should delete the account when we tap on the delete button', (done) => {
    browser
      .click(selector.listItem)
      .waitForExist(selector.accountDetailMore)
      .click(selector.accountDetailMore)
      .waitForExist(selector.accountDetailDelete)
      .pause(200)
      .click(selector.accountDetailDelete)
      .waitForExist(selector.modal)
      .pause(800)
      .click('[data-test=AccountDetailDelete]')
      .waitForExist(selector.accountListMore) // Home
      .getText(selector.listItem, (err, text) => {
        assert.equal(text, undefined);
      })
      .pause(400) // Wait for the Snackbar
      .getText(selector.snackbar, (err, text) => {
        assert.isAbove(text.length, 0, 'Snackbar message is not empty');
      })
      .call(done);
  });
});
