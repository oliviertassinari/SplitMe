/* eslint-disable no-console */

import express from 'express';
import csp from 'server/csp';
import rendering from 'server/rendering';
import locale from 'locale';
import apiRouter from 'server/apiRouter';

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
app.use('/api', apiRouter);
app.get('*', rendering);

let ipaddress = process.env.OPENSHIFT_NODEJS_IP;
const port = process.env.OPENSHIFT_NODEJS_PORT || PORT_DEV_EXPRESS;

if (typeof ipaddress === 'undefined') {
  console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
  ipaddress = '127.0.0.1';
}

Promise.all([locale.load('en'), locale.load('fr')]).then(() => {
  // Start the app on the specific interface (and port).
  app.listen(port, ipaddress, () => {
    console.log(`${Date(Date.now())}: Node server started on ${ipaddress}:${port} ✅`);
  });
});
