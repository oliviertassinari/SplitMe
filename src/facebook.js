'use strict';

const Lie = require('lie');
const config = require('config');

let promise;

function facebook() {
  if (!promise) {
    promise = new Lie(function(resolve) {
      if (config.platform === 'browser') {
        const facebookConnectPlugin = require('facebookConnectPlugin');

        window.fbAsyncInit = function() {
          facebookConnectPlugin.browserInit(config.facebookAppId, 'v2.4');
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
