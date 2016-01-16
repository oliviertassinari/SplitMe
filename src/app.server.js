import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match} from 'react-router';
import blueimpTmpl from 'blueimp-tmpl';
import DocumentTitle from 'react-document-title';
import Lie from 'lie';
import polyglot from 'polyglot';

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

const indexTmpl = blueimpTmpl(indexHtml);

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
      const localeName = locale.getBestLocale(req);
      locale.setCurrent(localeName);

      const markup = renderToString(
        <Root
          locale={localeName}
          router={renderProps}
          userAgent={req.headers['user-agent']}
        />
      );

      const string = indexTmpl({
        htmlWebpackPlugin: htmlWebpackPlugin,
        locale: localeName,
        markup: markup,
        title: DocumentTitle.rewind(),
        description: polyglot.t('product.description.long'),
      });

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
