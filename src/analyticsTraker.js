'use strict';

const store = require('redux/store');
const config = require('config');

function trackView(page) {
  window.analytics.trackView(page);
}

function getPath() {
  return store.getState().get('router').routes.reduce((path, route) => {
    if (route.path) {
      path += route.path;
    }

    return path;
  }, '');
}

const analyticsTraker = {
  onDeviceReady() {
    window.analytics.startTrackerWithId(config.googleAnalytics);

    let path = getPath();

    trackView(path);

    store.subscribe(() => {
      const pathPrevious = path;
      path = getPath();

      if (path !== pathPrevious) {
        trackView(path);
      }
    });

    window.onerror = function(message, url, line) {
      window.analytics.trackException(message + '|' + url + '|' + line, true); // (Description, Fatal)
    };
  },
};

module.exports = function() {
  document.addEventListener('deviceready', analyticsTraker.onDeviceReady, false);
};
