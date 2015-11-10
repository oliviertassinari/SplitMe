'use strict';

const Lie = require('lie');

const promise = new Lie((resolve) => {
  document.addEventListener('deviceready', () => {
    resolve(window.facebookConnectPlugin); // Not defined before the deviceready event
  }, false);
});

function facebook() {
  return promise;
}

module.exports = facebook;
