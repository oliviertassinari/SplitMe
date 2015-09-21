'use strict';

function crashReporter() {
  return function(next) {
    return function(action) {
      try {
        return next(action);
      } catch (err) {
        /**
         * Android
         * https://developers.google.com/analytics/devguides/collection/android/v4/exceptions
         */
        window.analytics.trackException(action.type + ' - ' + err, true); // (Description up to 100, Fatal)
        console.error('Caught an exception!', err);
      }
    };
  };
}

module.exports = crashReporter;
