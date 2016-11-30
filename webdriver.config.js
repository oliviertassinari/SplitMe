// @flow weak

require('babel-core/register');

exports.config = {
  specs: [
    './test/e2e/testAddExpense.js',
    './test/e2e/testDeleteExpense.js',
    './test/e2e/testEditExpense.js',
    './test/e2e/testDetailAccount.js',
    './test/e2e/testAddAccount.js',
    './test/e2e/testEditAccount.js',
    './test/e2e/testSettings.js',
    './test/e2e/testHome.js',
  ],
  maxInstances: 1,
  capabilities: [{
    browserName: 'chrome',
  }],
  sync: false,
  logLevel: 'silent',
  coloredLogs: true,
  baseUrl: '0.0.0.0:8000',
  waitforTimeout: 5000,
  framework: 'mocha',
  reporter: 'dot',
  mochaOpts: {
    ui: 'bdd',
    timeout: 600000, // 10min for long running tests
  },
  before: () => {
    global.browser.addCommand('waitForDialog', () => {
      return global.browser.pause(500);
    });

    global.browser.addCommand('waitForMenu', () => {
      return global.browser.pause(300);
    });

    global.browser.addCommand('urlApp', (url) => {
      return global.browser.url(`http://local.splitme.net:8000${url}`);
    });
  },
};
