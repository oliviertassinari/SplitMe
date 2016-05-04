/* globals browser */
import {assert} from 'chai';

import fixture from '../fixture';

describe('add account', () => {
  before((done) => {
    browser
      .url('http://local.splitme.net:8000/accounts?locale=fr')
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
      .waitForExist('.testAccountListMore', 5000, true)
      .call(done);
  });

  it('should show home when we close new account', (done) => {
    browser
      .click('[data-test=AppBar] button') // Close
      .waitForExist('[data-test=AccountAddSave]', 5000, true)
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.strictEqual(text, 'Mes comptes');
      })
      .call(done);
  });

  it('should show the add acount page when we navigate to the route', (done) => {
    browser
      .execute(fixture.executePushState, 'http://local.splitme.net:8000/account/add?locale=fr')
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.strictEqual(text, 'Nouveau compte');
      })
      .refresh()
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.strictEqual(text, 'Nouveau compte');
      })
      .call(done);
  });

  it('should show a modal to confirm when we navigate back form new account', (done) => {
    browser
      .execute(fixture.executePushState, 'http://local.splitme.net:8000/account/add?locale=fr')
      .waitForExist('[data-test=AccountAddSave]')
      .setValue('[data-test=AccountAddName]', 'Edited')
      .back()
      .waitForExist('[data-test=ModalButton1]')
      .pause(400)
      .click('[data-test=ModalButton1]') // Delete
      .pause(400) // Modal disappear
      .waitForExist('[data-test=AccountAddSave]', 5000, true)
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.strictEqual(text, 'Mes comptes');
      })
      .call(done);
  });

  it('should show home when we add a new account', (done) => {
    browser
      .execute(fixture.executePushState, 'http://local.splitme.net:8000/account/add?locale=fr')
      .waitForExist('[data-test=AccountAddSave]')
      .setValue('[data-test=AccountAddName]', 'Warsaw trip')
      .click('[data-test=MemberAdd]')
      .setValue('[data-test=MemberAddName]', 'Nicolas')
      .keys('Enter')
      .pause(300)
      .getText('[data-test=AccountAddMember]', (err, text) => {
        assert.deepEqual(text, [
          'Moi',
          'Nicolas',
        ]);
      })
      .click('[data-test=AccountAddSave]')
      .waitForExist('[data-test=AccountAddSave]', 5000, true)
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.strictEqual(text, 'Mes comptes');
      })
      .waitForExist('[data-test=ListItemBody]')
      .getText('[data-test=ListItemBody] span', (err, text) => {
        assert.strictEqual(text, 'Warsaw trip');
      })
      .pause(400) // Wait for the Snackbar
      .getText('[data-test=Snackbar]', (err, text) => {
        assert.strictEqual(text.length > 0, 'Snackbar message is not empty');
      })
      .click('[data-test=ListItem]')
      .waitForExist('.testAccountDetailMore')
      .click('.testAccountDetailMore')
      .waitForExist('[data-test=AccountDetailSettings]')
      .click('[data-test=AccountDetailSettings]')
      .getText('[data-test=AccountAddMember]', (err, text) => {
        assert.deepEqual(text, [
          'Moi',
          'Nicolas',
        ]);
      })
      .call(done);
  });
});
