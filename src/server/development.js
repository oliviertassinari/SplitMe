'use strict';

/**
 * This file is needed in order to make the code work on the node environement
 * without webpack.
 */

// Register babel to have ES6 support on the server
require('babel-register');

// Set the /src folder as root
const path = require('path');
require('app-module-path').addPath(path.join(__dirname, '../'));

process.env.CONFIG_NAME = 'browser.production';
process.env.PLATFORM = 'browser';

const packageJson = require('../../package.json');
process.env.VERSION = packageJson.version;

require('../server');
