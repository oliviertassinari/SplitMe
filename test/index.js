// @flow weak

require('app-module-path').addPath(`${__dirname}'./../src/`);
import minimist from 'minimist';
import Mocha from 'mocha';
import glob from 'glob';

const argv = minimist(process.argv.slice(2), {
  alias: {
    c: 'component',
    g: 'grep',
  },
});

const types = argv._;
const globPatterns = {
  unit: [
    `src/**/${argv.component ? argv.component : '*'}.test.js`,
    `test/**/${argv.component ? argv.component : '*'}.test.js`,
  ],
};

let pattern;

if (types.indexOf('unit') === -1) {
  pattern = Object.keys(globPatterns).map((n) => globPatterns[n]);
} else {
  pattern = types.map((n) => globPatterns[n]);
}

pattern = [].concat.apply([], pattern); // flatten the array

const mocha = new Mocha({
  grep: argv.grep ? argv.grep : undefined,
});

glob(
  pattern.length > 1 ? `{${pattern.join(',')}}` : pattern[0],
  {},
  (err, files) => {
    files.forEach((file) => mocha.addFile(file));
    mocha.run((failures) => {
      process.on('exit', () => {
        process.exit(failures); // eslint-disable-line no-process-exit
      });
    });
  }
);
