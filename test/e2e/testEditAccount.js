/* globals browser */
import {assert} from 'chai';
import Immutable from 'immutable';

import fixture from '../fixture';

describe('edit account', () => {
  before((done) => {
    const account = fixture.getAccount([{
      name: 'Alexandre',
      id: '10',
    }]);

    const expenses = new Immutable.List([
      fixture.getExpense({
        paidForContactIds: ['10'],
      }),
    ]);

    browser
      .url('http://local.splitme.net:8000/accounts?locale=fr')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account.toJS(), expenses.toJS()) // node.js context
      .call(done);
  });

  let accountEditUrl;

  it('should show edit account when we tap on the settings button', (done) => {
    browser
      .waitForExist('[data-test=ListItem]')
      .click('[data-test=ListItem]')
      .waitForExist('.testAccountDetailMore')
      .click('.testAccountDetailMore')
      .waitForExist('[data-test=AccountDetailSettings]')
      .click('[data-test=AccountDetailSettings]')
      .waitForExist('[data-test=AccountAddSave]')
      .getUrl().then((url) => {
        accountEditUrl = url;
      })
      .call(done);
  });

  it('should show edit account when we navigate to the route', (done) => {
    browser
      .execute(fixture.executePushState, 'http://local.splitme.net:8000/accounts?locale=fr')
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.strictEqual(text, 'Mes comptes');
      })
      .execute(fixture.executePushState, accountEditUrl)
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.strictEqual(text, 'Modifier le compte');
      })
      .refresh()
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.strictEqual(text, 'Modifier le compte');
      })
      .call(done);
  });

  it('should show detail when we tap on close account edit', (done) => {
    browser
      .click('[data-test=AppBar] button') // Close
      .waitForExist('[data-test=AccountAddSave]', 5000, true)
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.strictEqual(text, 'Alexandre');
      })
      .call(done);
  });

  it('should update the name of the account when enter an new name', (done) => {
    const newName = 'This is a new name';

    browser
      .click('.testAccountDetailMore')
      .waitForExist('[data-test=AccountDetailSettings]')
      .click('[data-test=AccountDetailSettings]')
      .waitForExist('[data-test=AccountAddName]')
      .setValue('[data-test=AccountAddName]', newName)
      .click('[data-test=AccountAddSave]')
      .waitForExist('[data-test=AccountAddSave]', 5000, true)
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.strictEqual(text, newName);
      })
      .click('[data-test=AppBar] button') // Close
      .waitForExist('.testAccountListMore') // Home
      .getText('[data-test=ListItemBody] span', (err, text) => {
        assert.strictEqual(text, newName);
      })
      .call(done);
  });

  it('should add a new member when ask for', (done) => {
    browser
      .click('[data-test=ListItem]')
      .waitForExist('.testAccountDetailMore')
      .click('.testAccountDetailMore')
      .waitForExist('[data-test=AccountDetailSettings]')
      .click('[data-test=AccountDetailSettings]')
      .click('[data-test=MemberAdd]')
      .setValue('[data-test=MemberAddName]', 'Nicolas')
      .keys('Enter')
      .pause(300)
      .getText('[data-test=AccountAddMember]', (err, text) => {
        assert.deepEqual(text, [
          'Moi',
          'Alexandre',
          'Nicolas',
        ]);
      })
      .click('[data-test=AccountAddSave]')
      .waitForExist('[data-test=AccountAddSave]', 5000, true)
      .click('.testAccountDetailMore')
      .waitForExist('[data-test=AccountDetailSettings]')
      .click('[data-test=AccountDetailSettings]')
      .getText('[data-test=AccountAddMember]', (err, text) => {
        assert.deepEqual(text, [
          'Moi',
          'Alexandre',
          'Nicolas',
        ]);
      })
      .click('[data-test=AppBar] button') // Close
      .waitForExist('[data-test=AccountAddSave]', 5000, true)
      .call(done);
  });

  it('should delete the account when we tap on the delete button', (done) => {
    browser
      .click('.testAccountDetailMore')
      .waitForExist('[data-test=AccountDetailDelete]')
      .pause(200)
      .click('[data-test=AccountDetailDelete]')
      .waitForExist('[data-test=ModalButton1]')
      .pause(800)
      .click('[data-test=ModalButton1]')
      .waitForExist('.testAccountListMore') // Home
      .isExisting('[data-test=ListItem]', (isExisting) => {
        assert.strictEqual(isExisting, false);
      })
      .pause(400) // Wait for the Snackbar
      .getText('[data-test=Snackbar]', (err, text) => {
        assert.strictEqual(text.length > 0, 'Snackbar message is not empty');
      })
      .call(done);
  });

  it('should dislay a not found page when the account do not exist', (done) => {
    browser
      .url('http://local.splitme.net:8000/account/1111111111/edit?locale=fr')
      .waitForExist('[data-test=TextIcon]')
      .getText('[data-test=TextIcon]', (err, text) => {
        assert.strictEqual(text, 'Compte introuvable');
      })
      .call(done);
  });
});
