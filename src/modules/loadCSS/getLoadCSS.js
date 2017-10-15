import fs from 'fs';

const loadCSS = fs.readFileSync('node_modules/fg-loadcss/src/loadCSS.js', 'utf-8');

export default function getLoadCSS(minified = true) {
  if (minified) {
    const UglifyJS = require('uglify-js');
    const minify = UglifyJS.minify(loadCSS);

    if (minify.error) {
      throw minify.error;
    }

    return minify.code;
  }

  return loadCSS;
}
