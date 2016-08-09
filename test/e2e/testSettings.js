// @flow weak

import {assert} from 'chai';
import fixture from '../fixture';

const data = [
  '{"version":"1.2.4","db_type":"idb","start_time":"2015-09-01T21:47:37.478Z","db_info":',
  '{"doc_count":3,"update_seq":4,"idb_attachment_format":"binary","db_name":"db",',
  '"auto_compaction":false,"adapter":"idb"}}\n',
  '{"docs":[{"_id":"_design/by_member_id","_rev":"1-5ff854963afbaefb5b22cf96a28a3bcc",',
  '"views":{"by_member_id":{"map":"function (doc) {',
  'if (doc._id.substring(0, 7) === \'account\') {',
  'emit(doc.members[1].id);}}"}}}]}\n',
  '{"seq":1}\n',
  '{"docs":[{"dateUpdated":1441144027,"account":null,"date":"2015-09-01","currency":"EUR",',
  '"amount":1,"paidByContactId":"0","split":"equaly","dateCreated":1441144027,"description":',
  '"expense 1","_id":"expense_1_1441144037660","_rev":"1-afde2d295ecfba7f3b5ddad18b317182",',
  '"paidFor":[{"contactId":"0","split_equaly":true,"split_unequaly":null,"split_shares":1},',
  '{"contactId":"1441144035160","split_equaly":true,"split_unequaly":null,"split_shares":1}]}]}\n',
  '{"seq":2}\n',
  '{"docs":[{"name":"Test import / export","share":false,"dateLatestExpense":',
  '"2015-09-01","couchDBDatabaseName":null,"_id":"account_1_1441144037685","_rev":',
  '"2-04d8d80b5dc795eb9ade310d20d51878","_revisions":{"start":2,"ids":',
  '["04d8d80b5dc795eb9ade310d20d51878","99219706faff75543274a74c8a6b2e56"]},"expenses":',
  '["expense_1_1441144037660"],"members":[{"id":"0","name":null,"email":null,"photo":null,',
  '"balances":[{"currency":"EUR","value":0.5}]},{"id":"1441144035160","name":',
  '"Alexandre Dupont","email":null,"photo":"https://avatars1.githubusercontent.com',
  '/u/3165635?v=3&s=140","balances":[{"currency":"EUR","value":-0.5}]}]}]}\n',
  '{"seq":4}\n',
].join('');

describe('settings', () => {
  before(() => {
    return global.browser
      .timeouts('script', 5000)
      .call();
  });

  describe('navigation', () => {
    it('should show the settings page when we navigate to the route', () => {
      return global.browser
        .url('http://local.splitme.net:8000/settings?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Paramètres');
        });
    });

    it('should show settings when we tap on the settings button', () => {
      return global.browser
        .url('http://local.splitme.net:8000/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .click('.testAccountListMore')
        .waitForExist('[data-test=Settings]')
        .click('[data-test=Settings]')
        .waitForExist('[data-test="SettingsImport"]')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Paramètres');
        });
    });

    it('should show home when we navigate back', () => {
      return global.browser
        .back()
        .waitForExist('.testAccountListMore')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Mes comptes');
        });
    });
  });

  describe('import', () => {
    it('should show correct account list when we import new data', () => {
      return global.browser
        .url('http://local.splitme.net:8000/settings?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .click('[data-test="SettingsImport"]')
        .waitForExist('[data-test="SettingsImportDialogOk"]')
        .execute(fixture.executeSetValue, '[data-test=SettingsImportTextarea]', data) // node.js context
        .click('[data-test="SettingsImportDialogOk"]')
        .waitForExist('[data-test="SettingsImportDialogOk"]', 5000, true)
        .pause(1000) // Modal disappear
        .click('[data-test="AppBar"] button') // Close
        .waitForExist('.testAccountListMore')
        .getText('[data-test="ListItemBody"] span')
        .then((text) => {
          assert.strictEqual(text, 'Test import / export');
        });
    });
  });

  describe('export', () => {
    it('should retreive the same data when we export', () => {
      return global.browser
        .url('http://local.splitme.net:8000/settings?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .click('[data-test="SettingsExport"]')
        .waitForExist('[data-test="SettingsExportTextarea"]')
        .getText('[data-test="SettingsExportTextarea"]')
        .then((text) => {
          text = text.split('}\n');

          assert.doesNotThrow(() => {
            text.forEach((line, index) => {
              if (index + 1 < text.length) {
                line += '}';
              }
              JSON.parse(line);
            });
          });
        });
    });
  });
});
