// @flow weak

import minimist from 'minimist';
import Mocha from 'mocha';
import glob from 'glob';
import locale from 'locale';

const argv = minimist(process.argv.slice(2), {
  alias: {
    c: 'component',
    g: 'grep',
  },
});

const globPatterns = [
  `src/**/${argv.component ? argv.component : '*'}.test.js`,
  `test/**/${argv.component ? argv.component : '*'}.test.js`,
];

const mocha = new Mocha({
  grep: argv.grep ? argv.grep : undefined,
  reporter: 'dot',
});

locale.load('en').then(() => {
  locale.setCurrent('en');

  glob(
    globPatterns.length > 1 ? `{${globPatterns.join(',')}}` : globPatterns[0],
    {},
    (err, files) => {
      files.forEach(file => mocha.addFile(file));
      mocha.run(failures => {
        process.on('exit', () => {
          process.exit(failures); // eslint-disable-line no-process-exit
        });
      });
    },
  );
});
