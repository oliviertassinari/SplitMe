'use strict';

const assert = require('chai').assert;

const selector = require('./selector');
const fixture = require('../fixture');

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

describe('settings', function() {
  before(function(done) {
    browser
      .url('http://0.0.0.0:8000?locale=fr')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .call(done);
  });

  it('should show settings when we tap on the settings button', function(done) {
    browser
      .click(selector.accountListMore)
      .waitForExist(selector.settings)
      .pause(200)
      .click(selector.settings)
      .waitForExist(selector.accountListMore, 1000, true)
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, 'Paramètres');
      })
      .call(done);
  });

  it('should show home when we navigate back', function(done) {
    browser
      .keys('Left arrow')
      .waitForExist(selector.accountListMore)
      .getText(selector.appBarTitle, function(err, text) {
        assert.equal(text, 'Mes comptes');
      })
      .call(done);
  });

  it('should show correct account list when we import new data', function(done) {
    browser
      .click(selector.accountListMore)
      .waitForExist(selector.settings)
      .pause(200)
      .click(selector.settings)
      .waitForExist(selector.accountListMore, 1000, true)
      .click(selector.settingsImport)
      .waitForExist(selector.settingsImportDialog)
      .pause(600)
      .execute(fixture.executeSetValue, selector.settingsImportTextarea, data) // node.js context
      .click(selector.settingsImportDialog + ' button:nth-child(2)') // OK
      .waitForExist(selector.settingsImportDialog, 1000, true)
      .keys('Left arrow')
      .waitForExist(selector.accountListMore)
      .getText(selector.listItemBody + ' span', function(err, text) {
        assert.equal(text, 'Test import / export');
      })
      .call(done);
  });

  it('should retreive the same data when we export', function(done) {
    browser
      .click(selector.accountListMore)
      .waitForExist(selector.settings)
      .pause(200)
      .click(selector.settings)
      .waitForExist(selector.accountListMore, 1000, true)
      .click(selector.settingsExport)
      .waitForExist(selector.settingsExportTextarea)
      .getText(selector.settingsExportTextarea, function(err, text) {
        text = text.split('}\n');

        assert.doesNotThrow(function() {
          text.forEach(function(line, index) {
            if (index + 1 < text.length) {
              line += '}';
            }

            JSON.parse(line);
          });
        });
      })
      .call(done);
  });

});
