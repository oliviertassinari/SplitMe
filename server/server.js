'use strict';

var express = require('express');

var SampleApp = function() {

  var self = this;

  /**
   *  terminator === the termination handler
   *  Terminate server on receipt of the specified signal.
   *  @param {string} sig  Signal to terminate on.
   */
  self.terminator = function(sig) {
    if (typeof sig === 'string') {
      console.log('%s: Received %s - terminating sample app ...',
             Date(Date.now()), sig);
      process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
  };

  self.initialize = function() {
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    self.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

    if (typeof self.ipaddress === 'undefined') {
      console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
      self.ipaddress = '127.0.0.1';
    }

    //  Process on exit and signals.
    process.on('exit', function() {
      self.terminator();
    });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
     'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM',
    ].forEach(function(element) {
      process.on(element, function() {
        self.terminator(element);
      });
    });

    self.app = express();
    self.app.disable('x-powered-by');
    self.app.use(express.static('./server/public', {
      etag: true,
      lastModified: false,
      setHeaders: function(res) {
        res.set('Cache-Control', 'no-cache');
      },
    }));
    self.app.use(express.static('./server/static', {
      etag: true,
      lastModified: false,
      maxAge: '1 year',
      index: false,
    }));
  };

  self.start = function() {

    //  Start the app on the specific interface (and port).
    self.app.listen(self.port, self.ipaddress, function() {
      console.log('%s: Node server started on %s:%d ...',
            Date(Date.now() ), self.ipaddress, self.port);
    });
  };
};

var zapp = new SampleApp();
zapp.initialize();
zapp.start();
