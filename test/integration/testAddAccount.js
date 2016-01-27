import {assert} from 'chai';

import fixture from '../fixture';

describe('add account', () => {
  before((done) => {
    browser
      .url('http://local.splitme.net:8000/?locale=fr#/accounts')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .call(done);
  });

  it('should show new account when we tap on the new account button', (done) => {
    browser
      .click('.testAccountListMore')
      .waitForExist('[data-test=AccountAddNew]')
      .pause(200)
      .click('[data-test=AccountAddNew]')
      .waitForExist('.testAccountListMore', 1000, true)
      .call(done);
  });

  it('should show home when we close new account', (done) => {
    browser
      .click('[data-test=AppBar] button') // Close
      .waitForExist('[data-test=AccountAddSave]', 1000, true)
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Mes comptes');
      })
      .call(done);
  });

  it('should show the add acount page when we navigate to the route', (done) => {
    browser
      .url('http://local.splitme.net:8000/?locale=fr#/account/add')
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Nouveau compte');
      })
      .refresh()
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Nouveau compte');
      })
      .call(done);
  });

  it('should show a modal to confirm when we navigate back form new account', (done) => {
    browser
      .url('http://local.splitme.net:8000/?locale=fr#/account/add')
      .waitForExist('[data-test=AccountAddSave]')
      .keys('Left arrow')
      .waitForExist('[data-test=ModalButton1]')
      .pause(400)
      .click('[data-test=ModalButton1]') // Delete
      .pause(400) // Modal disappear
      .waitForExist('[data-test=AccountAddSave]', 1000, true)
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Mes comptes');
      })
      .call(done);
  });

  it('should show home when we add a new expense', (done) => {
    browser
      .url('http://local.splitme.net:8000/?locale=fr#/account/add')
      .waitForExist('[data-test=AccountAddSave]')
      .setValue('[data-test=AccountAddName]', 'Warsaw trip')
      .click('[data-test=AccountAddSave]')
      .waitForExist('[data-test=AccountAddSave]', 1000, true)
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Mes comptes');
      })
      .pause(400) // Wait for the Snackbar
      .getText('[data-test=Snackbar]', (err, text) => {
        assert.isAbove(text.length, 0, 'Snackbar message is not empty');
      })
      .call(done);
  });
});
