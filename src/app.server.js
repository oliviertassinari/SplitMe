import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match} from 'react-router';
import blueimpTmpl from 'blueimp-tmpl';
import DocumentTitle from 'react-document-title';
import Lie from 'lie';
import polyglot from 'polyglot';
import {minify} from 'html-minifier';
import {createSelector} from 'reselect';

import config from 'config';
import locale from 'locale';
import routes from 'Main/routes';
import Root from 'Main/Root.server';
import indexHtml from './index.server.html';

const PORT_DEV_WEBPACK = 8000;
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

const indexTmpl = blueimpTmpl(minify(indexHtml, {
  collapseWhitespace: true,
  removeComments: true,
  minifyJS: true,
}));

let files;

if (process.env.NODE_ENV === 'production') {
  const assets = eval('require')('../static/assets.json');

  files = {
    css: {
      bundle: assets.main.css,
    },
    chunks: {
      bundle: {
        entry: assets.main.js,
      },
    },
  };
} else {
  files = {
    chunks: {
      bundle: {
        entry: `http://local.splitme.net:${PORT_DEV_WEBPACK}/browser.js`,
      },
    },
  };
}

const htmlWebpackPlugin = {
  files: files,
  options: {
    config: config,
  },
};

let renderSelectorRenderProps;

// Cache request
const renderSelector = createSelector(
  (state) => state.location,
  (state) => state.localeName,
  (state) => {
    if (state.userAgent && state.userAgent.indexOf('facebookexternalhit') !== -1) {
      return true;
    } else {
      return false;
    }
  },
  (location, localeName, isFacebookBot) => {
    const markup = renderToString(
      <Root
        router={renderSelectorRenderProps}
        locale={localeName}
      />
    );

    let tmplData = {};

    if (isFacebookBot) {
      tmplData = {
        localeISO: locale.iso[localeName],
        facebookLocaleAlternate: locale.availabled
          .filter((localeNameCurrent) => {
            return localeNameCurrent !== localeName;
          })
          .map((localeNameCurrent) => {
            return locale.iso[localeNameCurrent];
          }),
      };
    }

    const string = indexTmpl(Object.assign(
      {
        htmlWebpackPlugin: htmlWebpackPlugin,
        locale: localeName,
        markup: markup,
        title: DocumentTitle.rewind(),
        description: polyglot.t('product.description.long'),
        isFacebookBot: isFacebookBot,
      },
      tmplData,
    ));

    return string;
  }
);

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

      renderSelectorRenderProps = renderProps;

      const string = renderSelector({
        location: req.url,
        localeName: locale.getBestLocale(req),
        userAgent: req.headers['user-agent'],
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
