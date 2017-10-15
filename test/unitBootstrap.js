// Set the /src folder as root
require('app-module-path').addPath(`${__dirname}'./../src/`);

process.env.PLATFORM = 'server';

require('./unit');
