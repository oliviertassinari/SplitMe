// @flow weak

import {assert} from 'chai';
import fixture from '../fixture';

describe('add account', () => {
  before(() => {
    return global.browser
      .timeouts('script', 5000);
  });

  describe('navigation', () => {
    it('should show the add acount page when we navigate to the route', () => {
      return global.browser
        .url('http://local.splitme.net:8000/account/add?locale=fr')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Nouveau compte');
        });
    });

    it('should show home when we close new account', () => {
      return global.browser
        .url('http://local.splitme.net:8000/account/add?locale=fr')
        .click('[data-test="AppBar"] button') // Close
        .waitForExist('.testAccountListMore')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Mes comptes');
        });
    });

    it('should show new account when we tap on the new account button', () => {
      return global.browser
        .url('http://local.splitme.net:8000/accounts?locale=fr')
        .click('.testAccountListMore')
        .waitForExist('[data-test="AccountAddNew"]')
        .click('[data-test="AccountAddNew"]')
        .waitForExist('[data-test="AccountAddSave"]')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Nouveau compte');
        });
    });

    it('should show home when we navigate back', () => {
      return global.browser
        .url('http://local.splitme.net:8000/accounts?locale=fr')
        .click('.testAccountListMore')
        .waitForExist('[data-test="AccountAddNew"]')
        .click('[data-test="AccountAddNew"]')
        .waitForExist('[data-test="AccountAddSave"]')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Nouveau compte');
        })
        .back()
        .waitForExist('.testAccountListMore') // Home
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Mes comptes');
        });
    });

    it('should show a modal to confirm when we navigate back form new account', () => {
      return global.browser
        .click('.testAccountListMore')
        .waitForExist('[data-test="AccountAddNew"]')
        .click('[data-test="AccountAddNew"]')
        .waitForExist('.testAccountListMore', 5000, true)
        .setValue('[data-test="AccountAddName"]', 'Edited')
        .back()
        .waitForExist('[data-test="ModalButton1"]')
        .click('[data-test="ModalButton1"]') // Delete
        .waitForExist('[data-test="AccountAddSave"]', 5000, true)
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Mes comptes');
        });
    });
  });

  describe('save', () => {
    it('should show home when we add a new account', () => {
      return global.browser
        .url('http://local.splitme.net:8000/account/add?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .setValue('[data-test="AccountAddName"]', 'Warsaw trip')
        .click('[data-test="MemberAdd"]')
        .setValue('[data-test="MemberAddName"]', 'Nicolas')
        .keys('Enter')
        .pause(300) // Wait for the AutoComplete
        .getText('[data-test="AccountAddMember"]')
        .then((text) => {
          assert.deepEqual(text, [
            'Moi',
            'Nicolas',
          ]);
        })
        .click('[data-test="AccountAddSave"]')
        .waitForExist('[data-test="AccountAddSave"]', 5000, true)
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Mes comptes');
        })
        .waitForExist('[data-test="ListItemBody"]')
        .getText('[data-test="ListItemBody"] span')
        .then((text) => {
          assert.strictEqual(text, 'Warsaw trip');
        })
        .pause(400) // Wait for the Snackbar
        .getText('[data-test="Snackbar"]')
        .then((text) => {
          assert.strictEqual(text.length > 0, true, 'Snackbar message is not empty');
        });
    });

    it('should save the data correctly', () => {
      return global.browser
        .click('[data-test="ListItem"]')
        .waitForExist('.testAccountDetailMore')
        .click('.testAccountDetailMore')
        .waitForExist('[data-test="AccountDetailSettings"]')
        .click('[data-test="AccountDetailSettings"]')
        .getText('[data-test="AccountAddMember"]')
        .then((text) => {
          assert.deepEqual(text, [
            'Moi',
            'Nicolas',
          ]);
        });
    });
  });
});
