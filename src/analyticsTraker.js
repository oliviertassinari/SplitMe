'use strict';

const store = require('redux/store');
const config = require('config');

function trackView(page) {
  window.analytics.trackView(page);
}

function getPageCurrent() {
  return store.getState().getIn(['screen', 'page']);
}

const analyticsTraker = {
  onDeviceReady() {
    window.analytics.startTrackerWithId(config.googleAnalytics);

    let pageCurrent = getPageCurrent();

    trackView(pageCurrent);

    store.subscribe(() => {
      const pagePrevious = pageCurrent;
      pageCurrent = getPageCurrent();

      if (pageCurrent !== pagePrevious) {
        trackView(pageCurrent);
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
