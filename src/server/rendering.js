/* eslint-disable no-console */
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match} from 'react-router';
import blueimpTmpl from 'blueimp-tmpl';
import DocumentTitle from 'react-document-title';
import polyglot from 'polyglot';
import {minify} from 'html-minifier';
import fs from 'fs';
import UglifyJS from 'uglify-js';

import utils from 'utils';
import config from 'config';
import locale from 'locale';
import routes, {getLazyRouteName} from 'main/routes';
import Root from 'main/Root.server';
import indexHtml from 'index.server.html';
import createStyleManager from 'createStyleManager';


let loadCSSString = fs.readFileSync('node_modules/fg-loadcss/src/loadCSS.js', 'utf-8');
loadCSSString = UglifyJS.minify(loadCSSString, {
  fromString: true,
}).code;

let files;
let indexMinified = indexHtml;

if (process.env.NODE_ENV === 'production') {
  const assets = eval('require')('../../static/assets.json');

  indexMinified = minify(indexHtml, {
    collapseWhitespace: true,
    removeComments: true,
    minifyJS: true,
  });

  files = {
    css: [assets.main.css],
    js: [assets.main.js],
  };
} else {
  files = {
    js: ['/browser.js'],
  };
}

const indexTmpl = blueimpTmpl(indexMinified);

function render(input, more) {
  const styleManager = createStyleManager();
  const markup = renderToString(
    <Root
      router={more.renderProps}
      locale={input.localeName}
      styleManager={styleManager}
    />
  );

  const string = indexTmpl({
    files: files,
    config: config,
    locale: input.localeName,
    localeAvailable: locale.available,
    markup: markup,
    title: DocumentTitle.rewind(),
    description: polyglot.t('product.description_long'),
    isMediaBot: input.isMediaBot,
    loadCSS: loadCSSString,
    lazyRouteName: getLazyRouteName(),
    sheets: styleManager.renderSheetsToString(),
  });

  return string;
}

const memoizeStore = {};

function memoizeRender(input, more) {
  const key = JSON.stringify(input);

  if (!memoizeStore[key]) {
    memoizeStore[key] = render(input, more);
  }

  return memoizeStore[key];
}

function isMediaBot(userAgent) {
  let output = false;

  if (userAgent && (
    userAgent.indexOf('facebookexternalhit') !== -1 ||
    userAgent.indexOf('Twitterbot') !== -1
    )) {
    output = true;
  }

  return output;
}

export default (req, res) => {
  // Redirect the product page to a localized version
  if (req.path === '/' && req.query.launcher !== 'true') {
    const localeName = locale.getBestLocale(req);
    res.redirect(302, `/${localeName}`);
    return;
  }

  match({
    routes: routes,
    location: req.url,
  }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      console.time('renderToString');

      const userAgent = req.headers['user-agent'];

      const string = memoizeRender({
        localeName: locale.getBestLocale(req),
        isMediaBot: isMediaBot(userAgent),
        routesPath: utils.getRoutesPath(renderProps),
      }, {
        renderProps: renderProps,
      });

      console.timeEnd('renderToString');
      console.log(req.url, locale.getBestLocale(req), req.headers['user-agent']);

      res.status(200).send(string);
    } else {
      res.status(404).send('Not found');
    }
  });
};
