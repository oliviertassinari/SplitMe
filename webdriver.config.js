'use strict';

require('babel-core/register');

exports.config = {
  specs: [
    './test/feature/testAddExpense.js',
    './test/feature/testDeleteExpense.js',
    './test/feature/testEditExpense.js',
    './test/feature/testDetailAccount.js',
    './test/feature/testAddAccount.js',
    './test/feature/testEditAccount.js',
    './test/feature/testSettings.js',
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
