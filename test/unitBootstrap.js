// @flow weak

/**
 * This file is needed in order to make the tests work on the node environement
 * without webpack.
 */
require('../babelBootstrap');

// Set the /src folder as root
require('app-module-path').addPath(`${__dirname}'./../src/`);

process.env.PLATFORM = 'server';

require('./unit');
