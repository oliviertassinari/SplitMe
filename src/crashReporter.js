'use strict';

function crashReporter() {
  return function(next) {
    return function(action) {
      try {
        return next(action);
      } catch (err) {
        console.error('Caught an exception!', err);
        window.analytics.trackException('action ' + action.type + ' - ' + err, true); // (Description, Fatal)
        throw err;
      }
    };
  };
}

module.exports = crashReporter;
