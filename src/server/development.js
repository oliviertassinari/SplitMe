
/**
 * This file is needed in order to make the code work on the node environement
 * without webpack.
 */

require('../../babelBootstrap');

// Set the /src folder as root
const path = require('path');
require('app-module-path').addPath(path.join(__dirname, '../'));

// Add some global
process.env.CONFIG_NAME = 'server.development';
process.env.PLATFORM = 'server';

const packageJson = require('../../package.json');

process.env.VERSION = packageJson.version;

// Process files with the extension server as normal
require.extensions['.server.js'] = require.extensions['.js'];

require('../app.server');
