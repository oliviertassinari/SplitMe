'use strict';

const pluginAnalytics = require('plugin/analytics');

function crashReporter() {
  return next => action => {
    try {
      return next(action);
    } catch (err) {
      pluginAnalytics.trackException(action.type + ' - ' + err, true);

      console.error('Caught an exception!', err);
    }
  };
}

module.exports = crashReporter;
