'use strict';

var Lie = require('lie');

var promise;

function facebook() {
  if (!promise) {
    promise = new Lie(function(resolve) {
      if (process.env.NODE_ENV === 'development') {
        var facebookConnectPlugin = require('facebookConnectPlugin');

        window.fbAsyncInit = function() {
          facebookConnectPlugin.browserInit('102937960055510', 'v2.4');
          resolve(facebookConnectPlugin);
        };
      } else {
        document.addEventListener('deviceready', function() {
          resolve(window.facebookConnectPlugin); // Not defined before the onDeviceReady event
        }, false);
      }
    });
  }

  return promise;
}

module.exports = facebook;
