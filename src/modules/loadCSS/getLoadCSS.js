import fs from 'fs';

let loadCSS = fs.readFileSync('node_modules/fg-loadcss/src/loadCSS.js', 'utf-8');

export default function getLoadCSS(minified = true) {
  if (minified) {
    const UglifyJS = require('uglify-js');

    loadCSS = UglifyJS.minify(loadCSS, {
      fromString: true,
    }).code;

    return loadCSS;
  }

  return loadCSS;
}
