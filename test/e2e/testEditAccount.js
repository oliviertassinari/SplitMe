// @flow weak

import {assert} from 'chai';
import Immutable from 'immutable';
import fixture from '../fixture';

const account = fixture.getAccount([{
  name: 'Alexandre',
  id: '10',
}]);

const expenses = new Immutable.List([
  fixture.getExpense({
    paidForContactIds: ['10'],
  }),
]);

describe('edit account', () => {
  before((done) => {
    return global.browser
      .timeouts('script', 5000)
      .call(done);
  });

  describe('navigation', () => {
    let accountEditUrl;

    it('should dislay a not found page when the account do not exist', (done) => {
      global.browser
        .url('http://local.splitme.net:8000/account/1111111111/edit?locale=fr')
        .waitForExist('[data-test="TextIcon"]')
        .getText('[data-test="TextIcon"]')
        .then((text) => {
          assert.strictEqual(text, 'Compte introuvable');
        })
        .call(done);
    });

    it('should show edit account when we tap on the settings button', (done) => {
      global.browser
        .url('http://local.splitme.net:8000/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account.toJS(), expenses.toJS()) // node.js context
        .waitForExist('[data-test="ListItem"]')
        .click('[data-test="ListItem"]')
        .waitForExist('.testAccountDetailMore')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Alexandre');
        })
        .click('.testAccountDetailMore')
        .waitForExist('[data-test="AccountDetailSettings"]')
        .click('[data-test="AccountDetailSettings"]')
        .waitForExist('[data-test="AccountAddSave"]')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Modifier le compte');
        })
        .getUrl()
        .then((url) => {
          accountEditUrl = url;
        })
        .call(done);
    });

    it('should show home when we navigate back', (done) => {
      global.browser
        .back()
        .waitForExist('.testAccountDetailMore')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Alexandre');
        })
        .call(done);
    });

    it('should show edit account when we navigate to the route', (done) => {
      global.browser
        .url(accountEditUrl)
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Modifier le compte');
        })
        .call(done);
    });

    it('should show detail when we tap on close account edit', (done) => {
      global.browser
        .url(accountEditUrl)
        .click('[data-test="AppBar"] button') // Close
        .waitForExist('.testAccountDetailMore')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Alexandre');
        })
        .call(done);
    });
  });

  describe('update name', () => {
    it('should update the name of the account when enter an new name', (done) => {
      const newName = 'This is a new name';

      global.browser
        .url('http://local.splitme.net:8000/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account.toJS(), expenses.toJS()) // node.js context
        .waitForExist('[data-test="ListItem"]')
        .click('[data-test="ListItem"]')
        .waitForExist('.testAccountDetailMore')
        .click('.testAccountDetailMore')
        .waitForExist('[data-test="AccountDetailSettings"]')
        .click('[data-test="AccountDetailSettings"]')
        .waitForExist('[data-test="AccountAddSave"]')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Modifier le compte');
        })
        .setValue('[data-test=AccountAddName]', newName)
        .click('[data-test="AccountAddSave"]')
        .waitForExist('.testAccountDetailMore')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, newName);
        })
        .click('[data-test="AppBar"] button') // Close
        .waitForExist('.testAccountListMore') // Home
        .getText('[data-test="ListItemBody"] span')
        .then((text) => {
          assert.strictEqual(text, newName);
        })
        .call(done);
    });
  });

  describe('add member', () => {
    it('should add a new member when ask for', (done) => {
      global.browser
        .url('http://local.splitme.net:8000/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account.toJS(), expenses.toJS()) // node.js context
        .waitForExist('[data-test="ListItem"]')
        .click('[data-test="ListItem"]')
        .waitForExist('.testAccountDetailMore')
        .click('.testAccountDetailMore')
        .waitForExist('[data-test="AccountDetailSettings"]')
        .click('[data-test="AccountDetailSettings"]')
        .waitForExist('[data-test="AccountAddSave"]')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Modifier le compte');
        })
        .getText('[data-test="AccountAddMember"]')
        .then((text) => {
          assert.deepEqual(text, [
            'Moi',
            'Alexandre',
          ]);
        })
        .click('[data-test=MemberAdd]')
        .setValue('[data-test=MemberAddName]', 'Nicolas')
        .keys('Enter')
        .pause(300)
        .getText('[data-test="AccountAddMember"]')
        .then((text) => {
          assert.deepEqual(text, [
            'Moi',
            'Alexandre',
            'Nicolas',
          ]);
        })
        .click('[data-test="AccountAddSave"]')
        .waitForExist('[data-test="AccountAddSave"]', 5000, true)
        .click('.testAccountDetailMore')
        .waitForExist('[data-test="AccountDetailSettings"]')
        .click('[data-test="AccountDetailSettings"]')
        .getText('[data-test="AccountAddMember"]')
        .then((text) => {
          assert.deepEqual(text, [
            'Moi',
            'Alexandre',
            'Nicolas',
          ]);
        })
        .click('[data-test="AppBar"] button') // Close
        .waitForExist('[data-test="AccountAddSave"]', 5000, true)
        .call(done);
    });
  });

  describe('delete', () => {
    it('should delete the account when we tap on the delete button', (done) => {
      global.browser
        .url('http://local.splitme.net:8000/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account.toJS(), expenses.toJS()) // node.js context
        .waitForExist('[data-test="ListItem"]')
        .click('[data-test="ListItem"]')
        .waitForExist('.testAccountDetailMore')
        .click('.testAccountDetailMore')
        .waitForExist('[data-test=AccountDetailDelete]')
        .click('[data-test=AccountDetailDelete]')
        .waitForExist('[data-test="ModalButton1"]')
        .click('[data-test="ModalButton1"]')
        .waitForExist('.testAccountListMore') // Home
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Mes comptes');
        })
        .isExisting('[data-test="ListItem"]', (isExisting) => {
          assert.strictEqual(isExisting, false);
        })
        .pause(400) // Wait for the Snackbar
        .getText('[data-test="Snackbar"]')
        .then((text) => {
          assert.strictEqual(text.length > 0, true, 'Snackbar message is not empty');
        })
        .call(done);
    });
  });
});
