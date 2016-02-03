'use strict';

/**
 * This file is needed in order to make the code work on the node environement
 * without webpack.
 */

// Register babel to have ES6 support on the server
const babelRegister = require('babel-register');

babelRegister({
  only: /material-ui|src/,
});

// Set the /src folder as root
const path = require('path');
require('app-module-path').addPath(path.join(__dirname, '../'));

process.env.CONFIG_NAME = 'server.development';
process.env.PLATFORM = 'server';

const packageJson = require('../../package.json');
process.env.VERSION = packageJson.version;

// Process files with the extension server as normal
require.extensions['.server.jsx'] = require.extensions['.jsx'];
require.extensions['.server.js'] = require.extensions['.js'];

require('../app.server');
