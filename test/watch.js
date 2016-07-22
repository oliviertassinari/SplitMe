// @flow weak
/* eslint-disable no-console */

import nodemon from 'nodemon';

nodemon({
  args: process.argv,
  script: 'test/index.js',
  execMap: {
    js: 'node_modules/.bin/babel-node',
  },
  ext: 'js',
  watch: ['src/'],
});

nodemon.on('start', () => {
  console.log('Test have started');
}).on('quit', () => {
  console.log('Test have quit');
  process.exit(); // eslint-disable-line no-process-exit
}).on('restart', (files) => {
  console.log('Test restarted due to: ', files);
});
