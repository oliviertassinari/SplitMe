import { assert } from 'chai';
import fixture from '../fixture';

describe('settings', () => {
  before(() => {
    return global.browser.timeouts('script', 5000).call();
  });

  describe('navigation', () => {
    it('should show the settings page when we navigate to the route', () => {
      return global.browser
        .urlApp('/settings?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .getText('[data-test="AppBar"] h1')
        .then(text => {
          assert.strictEqual(text, 'Paramètres');
        });
    });

    it('should show settings when we tap on the settings button', () => {
      return global.browser
        .urlApp('/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .click('.testAccountListMore')
        .waitForMenu()
        .waitForExist('[data-test=Settings]')
        .click('[data-test=Settings]')
        .waitForExist('[data-test="SettingsImport"]')
        .getText('[data-test="AppBar"] h1')
        .then(text => {
          assert.strictEqual(text, 'Paramètres');
        });
    });

    it('should show home when we navigate back', () => {
      return global.browser
        .back()
        .waitForExist('.testAccountListMore')
        .getText('[data-test="AppBar"] h1')
        .then(text => {
          assert.strictEqual(text, 'Mes comptes');
        });
    });
  });

  describe('import', () => {
    it('should show correct account list when we import new data', () => {
      return global.browser
        .urlApp('/settings?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .click('[data-test="SettingsImport"]')
        .waitForDialog()
        .waitForExist('[data-test="SettingsImportTextarea"]')
        .execute(
          fixture.executeSetValue,
          '[data-test=SettingsImportTextarea]',
          fixture.getRawDate(),
        ) // node.js context
        .click('[data-test="SettingsImportDialogOk"]')
        .waitForExist('[data-test="SettingsImportDialogOk"]', 5000, true)
        .pause(1000) // Modal disappear
        .getText('[data-test="Snackbar"]')
        .then(text => {
          assert.strictEqual(text.length > 0, true, 'Snackbar message is not empty');
        })
        .click('[data-test="AppBar"] button') // Close
        .waitForExist('[data-test="ListItemBody"] span')
        .getText('[data-test="ListItemBody"] span')
        .then(text => {
          assert.strictEqual(text, 'Test import / export');
        });
    });
  });

  describe('export', () => {
    it('should retreive the same data when we export', () => {
      return global.browser
        .urlApp('/settings?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .click('[data-test="SettingsExport"]')
        .waitForExist('[data-test="SettingsExportTextarea"]')
        .getText('[data-test="SettingsExportTextarea"]')
        .then(text => {
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
