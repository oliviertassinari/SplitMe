import {assert} from 'chai';

import selector from './selector';
import fixture from '../fixture';

describe('add new account', () => {
  before((done) => {
    browser
      .url('http://0.0.0.0:8000/?locale=fr')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .call(done);
  });

  it('should show new account when we tap on the new account button', (done) => {
    browser
      .click(selector.accountListMore)
      .waitForExist(selector.accountAddNew)
      .pause(200)
      .click(selector.accountAddNew)
      .waitForExist(selector.accountListMore, 1000, true)
      .call(done);
  });

  it('should show home when we close new account', (done) => {
    browser
      .click(selector.appBarLeftButton) // Close
      .waitForExist(selector.accountAddSave, 1000, true)
      .getText(selector.appBarTitle, (err, text) => {
        assert.equal(text, 'Mes comptes');
      })
      .call(done);
  });

  it('should show a modal to confirm when we navigate back form new account', (done) => {
    browser
      .url('http://0.0.0.0:8000/?locale=fr#/account/add')
      .waitForExist(selector.accountAddSave)
      .keys('Left arrow')
      .waitForExist(selector.modal)
      .pause(400)
      .click(selector.modal + ' button:nth-child(2)') // Delete
      .pause(400) // Modal disappear
      .waitForExist(selector.accountAddSave, 1000, true)
      .getText(selector.appBarTitle, (err, text) => {
        assert.equal(text, 'Mes comptes');
      })
      .call(done);
  });

  it('should show home when we add a new expense', (done) => {
    browser
      .url('http://0.0.0.0:8000/?locale=fr#/account/add')
      .waitForExist(selector.accountAddSave)
      .setValue(selector.accountAddName, 'Warsaw trip')
      .click(selector.accountAddSave)
      .waitForExist(selector.accountAddSave, 1000, true)
      .getText(selector.appBarTitle, (err, text) => {
        assert.equal(text, 'Mes comptes');
      })
      .pause(400) // Wait for the Snackbar
      .getText(selector.snackbar, (err, text) => {
        assert.isAbove(text.length, 0, 'Snackbar message is not empty');
      })
      .call(done);
  });
});
