/* eslint-disable no-console */

import express from 'express';
import csp from 'server/csp';
import rendering from 'server/rendering';
import locale from 'locale';

const PORT_DEV_EXPRESS = 8080;

/**
 * terminator === the termination handler
 * Terminate server on receipt of the specified signal.
 * @param {string} sig  Signal to terminate on.
 */
function terminator(sig) {
  if (typeof sig === 'string') {
    console.log(`${Date(Date.now())}: Received ${sig}.`);
    process.exit(1); // eslint-disable-line no-process-exit
  }

  console.log(`${Date(Date.now())}: Node server stopped.`);
}

//  Process on exit and signals.
process.on('exit', () => {
  terminator();
});

// Removed 'SIGPIPE' from the list - bugz 852598.
[
  'SIGHUP',
  'SIGINT',
  'SIGQUIT',
  'SIGILL',
  'SIGTRAP',
  'SIGABRT',
  'SIGBUS',
  'SIGFPE',
  'SIGUSR1',
  'SIGSEGV',
  'SIGUSR2',
  'SIGTERM',
].forEach(element => {
  process.on(element, () => {
    terminator(element);
  });
});

const app = express();
app.disable('x-powered-by');
app.use(csp); // Content Security Policy
app.use(
  express.static('./server/public', {
    etag: true,
    lastModified: false,
    setHeaders: res => {
      res.set('Cache-Control', 'no-cache');
    },
  }),
);
app.use(
  express.static('./server/static', {
    etag: true,
    lastModified: false,
    maxAge: '1 year',
    index: false,
  }),
);
app.get('*', rendering);

const port = process.env.PORT || PORT_DEV_EXPRESS;

Promise.all([locale.load('en'), locale.load('fr')]).then(() => {
  // Start the app on the specific interface (and port).
  app.listen(port, () => {
    console.log(`${Date(Date.now())}: Node server started on http://localhost:${port} ✅`);
  });
});
