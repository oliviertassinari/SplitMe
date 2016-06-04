/* globals browser */
import {assert} from 'chai';

import fixture from '../fixture';

describe('add account', () => {
  before((done) => {
    return browser
      .timeouts('script', 5000)
      .call(done);
  });

  describe('navigation', () => {
    it('should show the add acount page when we navigate to the route', (done) => {
      browser
        .url('http://local.splitme.net:8000/account/add?locale=fr')
        .getText('[data-test=AppBar] h1')
        .then((text) => {
          assert.strictEqual(text, 'Nouveau compte');
        })
        .call(done);
    });

    it('should show home when we close new account', (done) => {
      browser
        .url('http://local.splitme.net:8000/account/add?locale=fr')
        .click('[data-test=AppBar] button') // Close
        .waitForExist('[data-test=AccountAddSave]', 5000, true)
        .getText('[data-test=AppBar] h1')
        .then((text) => {
          assert.strictEqual(text, 'Mes comptes');
        })
        .call(done);
    });

    it('should show new account when we tap on the new account button', (done) => {
      browser
        .url('http://local.splitme.net:8000/accounts?locale=fr')
        .click('.testAccountListMore')
        .waitForExist('[data-test=AccountAddNew]')
        .click('[data-test=AccountAddNew]')
        .waitForExist('.testAccountListMore', 5000, true)
        .getText('[data-test=AppBar] h1')
        .then((text) => {
          assert.strictEqual(text, 'Nouveau compte');
        })
        .call(done);
    });

    it('should show home when we navigate back', (done) => {
      browser
        .url('http://local.splitme.net:8000/accounts?locale=fr')
        .click('.testAccountListMore')
        .waitForExist('[data-test=AccountAddNew]')
        .click('[data-test=AccountAddNew]')
        .waitForExist('.testAccountListMore', 5000, true)
        .getText('[data-test=AppBar] h1')
        .then((text) => {
          assert.strictEqual(text, 'Nouveau compte');
        })
        .back()
        .waitForExist('.testAccountListMore') // Home
        .getText('[data-test=AppBar] h1')
        .then((text) => {
          assert.strictEqual(text, 'Mes comptes');
        })
        .call(done);
    });

    it('should show a modal to confirm when we navigate back form new account', (done) => {
      browser
        .click('.testAccountListMore')
        .waitForExist('[data-test=AccountAddNew]')
        .click('[data-test=AccountAddNew]')
        .waitForExist('.testAccountListMore', 5000, true)
        .setValue('[data-test=AccountAddName]', 'Edited')
        .back()
        .waitForExist('[data-test=ModalButton1]')
        .click('[data-test=ModalButton1]') // Delete
        .waitForExist('[data-test=AccountAddSave]', 5000, true)
        .getText('[data-test=AppBar] h1')
        .then((text) => {
          assert.strictEqual(text, 'Mes comptes');
        })
        .call(done);
    });
  });

  describe('save', () => {
    it('should show home when we add a new account', (done) => {
      browser
        .url('http://local.splitme.net:8000/account/add?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .setValue('[data-test=AccountAddName]', 'Warsaw trip')
        .click('[data-test=MemberAdd]')
        .setValue('[data-test=MemberAddName]', 'Nicolas')
        .keys('Enter')
        .pause(300) // Wait for the AutoComplete
        .getText('[data-test=AccountAddMember]')
        .then((text) => {
          assert.deepEqual(text, [
            'Moi',
            'Nicolas',
          ]);
        })
        .click('[data-test=AccountAddSave]')
        .waitForExist('[data-test=AccountAddSave]', 5000, true)
        .getText('[data-test=AppBar] h1')
        .then((text) => {
          assert.strictEqual(text, 'Mes comptes');
        })
        .waitForExist('[data-test=ListItemBody]')
        .getText('[data-test=ListItemBody] span')
        .then((text) => {
          assert.strictEqual(text, 'Warsaw trip');
        })
        .pause(400) // Wait for the Snackbar
        .getText('[data-test=Snackbar]')
        .then((text) => {
          assert.strictEqual(text.length > 0, true, 'Snackbar message is not empty');
        })
        .call(done);
    });

    it('should save the data correctly', (done) => {
      browser
        .click('[data-test=ListItem]')
        .waitForExist('.testAccountDetailMore')
        .click('.testAccountDetailMore')
        .waitForExist('[data-test=AccountDetailSettings]')
        .click('[data-test=AccountDetailSettings]')
        .getText('[data-test=AccountAddMember]')
        .then((text) => {
          assert.deepEqual(text, [
            'Moi',
            'Nicolas',
          ]);
        })
        .call(done);
    });
  });
});
