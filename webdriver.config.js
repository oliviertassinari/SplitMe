'use strict';

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
  sync: true,
  logLevel: 'silent',
  coloredLogs: true,
  baseUrl: '0.0.0.0:8000',
  waitforTimeout: 5000,
  framework: 'mocha',
  reporter: 'spec',
  mochaOpts: {
    ui: 'bdd',
    timeout: 20000,
  },
};
