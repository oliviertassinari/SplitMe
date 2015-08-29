'use strict';

var store = require('redux/store');

function trackView(page) {
  window.analytics.trackView(page);
}

function getPageCurrent() {
  return store.getState().getIn(['screen', 'page']);
}

var analyticsTraker = {
  onDeviceReady: function() {
    var analytics = window.analytics; // Not defined before the onDeviceReady event

    analytics.startTrackerWithId('UA-44093216-2');

    var pageCurrent = getPageCurrent();

    trackView(pageCurrent);

    store.subscribe(function() {
      var pagePrevious = pageCurrent;
      pageCurrent = getPageCurrent();

      if (pageCurrent !== pagePrevious) {
        trackView(pageCurrent);
      }
    });

    window.onerror = function(message, url, line) {
      analytics.trackException(message + '|' + url + '|' + line, true); // (Description, Fatal)
    };
  },
};

module.exports = {
  crashReporter: function() {
    return function(next) {
      return function(action) {
        try {
          return next(action);
        } catch(err) {
          console.error('Caught an exception!', err);
          window.analytics.trackException('action ' + action.type + ' - ' + err, true); // (Description, Fatal)
          throw err;
        }
      };
    };
  },
  load: function() {
    document.addEventListener('deviceready', analyticsTraker.onDeviceReady, false);
  },
};
