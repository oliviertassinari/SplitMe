'use strict';

var pageStore = require('./Main/pageStore');

function trackView() {
  window.analytics.trackView(pageStore.get());
}

var analyticsTracker = {
  onDeviceReady: function () {
    var analytics = window.analytics;

    analytics.startTrackerWithId('UA-44093216-2');

    trackView();

    pageStore.addChangeListener(function() {
      trackView();
    });

    window.onerror = function(message, url, line) {
      analytics.trackException(message + '|' + url + '|' + line, false);
    };
  },
};

module.exports = analyticsTracker;
