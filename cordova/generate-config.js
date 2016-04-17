import minimist from 'minimist';
import blueimpTmpl from 'blueimp-tmpl';
import fs from 'fs';
import path from 'path';
import pkg from '../package.json';

const argv = minimist(process.argv.slice(2));

let config;

try {
  config = require(`../config/${argv.config}`);
} catch (err) {
  config = {};
}

const configTplPath = path.join(__dirname, './config.tmpl');
const configPath = path.join(__dirname, './config.xml');

const tmpl = blueimpTmpl(fs.readFileSync(configTplPath, 'utf-8'));

fs.writeFileSync(configPath, tmpl({
  ...config,
  version: pkg.version,
}));
