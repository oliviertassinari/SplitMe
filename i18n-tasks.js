// @flow weak

import {
  extractFromFiles,
  findMissing,
  findUnused,
  findDuplicated,
  forbidDynamic,
  flatten,
} from 'i18n-extract';
import frLocale from './src/locale/frLocale';

const frLocaleFlattened = flatten(frLocale);

const keys = extractFromFiles([
  'src/**/*.js',
], {
  marker: 'polyglot.t',
});

let reports = [];
reports = reports.concat(findMissing(frLocaleFlattened, keys));
reports = reports.concat(findUnused(frLocaleFlattened, keys));
reports = reports.concat(findDuplicated(frLocaleFlattened, keys));
reports = reports.concat(forbidDynamic(frLocaleFlattened, keys));

if (reports.length > 0) {
  console.log(reports); // eslint-disable-line no-console
  throw new Error('There is some issues with the i18n keys');
}
