'use strict';

require('babel-core/register');

exports.config = {
  specs: [
    './test/integration/testAddExpense.js',
    './test/integration/testDeleteExpense.js',
    './test/integration/testEditExpense.js',
    './test/integration/testDetailAccount.js',
    './test/integration/testAddAccount.js',
    './test/integration/testEditAccount.js',
    './test/integration/testSettings.js',
    './test/integration/testHome.js',
  ],
  capabilities: [{
    browserName: 'chrome',
  }],
  logLevel: 'silent',
  coloredLogs: true,
  baseUrl: '0.0.0.0:8000',
  waitforTimeout: 1000,
  framework: 'mocha',
  reporter: 'spec',
  mochaOpts: {
    ui: 'bdd',
  },
};
