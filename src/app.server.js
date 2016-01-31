import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match} from 'react-router';
import blueimpTmpl from 'blueimp-tmpl';
import DocumentTitle from 'react-document-title';
import Lie from 'lie';
import polyglot from 'polyglot';
import {minify} from 'html-minifier';

import config from 'config';
import locale from 'locale';
import routes from 'Main/routes';
import Root from 'Main/Root.server';
import indexHtml from './index.server.html';

const PORT_DEV_EXPRESS = 8080;

/**
 * terminator === the termination handler
 * Terminate server on receipt of the specified signal.
 * @param {string} sig  Signal to terminate on.
 */
function terminator(sig) {
  if (typeof sig === 'string') {
    console.log('%s: Received %s - terminating sample app ...',
      Date(Date.now()), sig);
    process.exit(1);
  }
  console.log('%s: Node server stopped.', Date(Date.now()) );
}

//  Process on exit and signals.
process.on('exit', () => {
  terminator();
});

// Removed 'SIGPIPE' from the list - bugz 852598.
['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM',
].forEach((element) => {
  process.on(element, () => {
    terminator(element);
  });
});

let files;
let indexMinified = indexHtml;

if (process.env.NODE_ENV === 'production') {
  const assets = eval('require')('../static/assets.json');

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
  const markup = renderToString(
    <Root
      router={more.renderProps}
      locale={input.localeName}
    />
  );

  let tmplData = {};

  if (input.isFacebookBot) {
    tmplData = {
      localeISO: locale.data[input.localeName].iso,
      facebookLocaleAlternate: locale.availabled
        .filter((localeNameCurrent) => {
          return localeNameCurrent !== input.localeName;
        })
        .map((localeNameCurrent) => {
          return locale.data[localeNameCurrent].iso;
        }),
    };
  }

  const string = indexTmpl(Object.assign(
    {
      files: files,
      config: config,
      locale: input.localeName,
      markup: markup,
      title: DocumentTitle.rewind(),
      description: polyglot.t('product.description.long'),
      isFacebookBot: input.isFacebookBot,
    },
    tmplData,
  ));

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

function getRoutesPath(renderProps) {
  return renderProps.routes.reduce((path, route) => {
    if (route.path) {
      path += route.path;
    }

    return path;
  }, '');
}

const app = express();
app.disable('x-powered-by');
app.use(express.static('./server/public', {
  etag: true,
  lastModified: false,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-cache');
  },
}));
app.use(express.static('./server/static', {
  etag: true,
  lastModified: false,
  maxAge: '1 year',
  index: false,
}));
app.get('*', (req, res) => {
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

      let isFacebookBot = false;

      if (userAgent && userAgent.indexOf('facebookexternalhit') !== -1) {
        isFacebookBot = true;
      }

      const string = memoizeRender({
        localeName: locale.getBestLocale(req),
        isFacebookBot: isFacebookBot,
        routesPath: getRoutesPath(renderProps),
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
});

let ipaddress = process.env.OPENSHIFT_NODEJS_IP;
const port = process.env.OPENSHIFT_NODEJS_PORT || PORT_DEV_EXPRESS;

if (typeof ipaddress === 'undefined') {
  console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
  ipaddress = '127.0.0.1';
}

Lie.all([
  locale.load('en'),
  locale.load('fr'),
]).then(() => {
  // Start the app on the specific interface (and port).
  app.listen(port, ipaddress, () => {
    console.log('%s: Node server started on %s:%d ✅', Date(Date.now()), ipaddress, port);
  });
});
