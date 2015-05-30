'use strict';

var pageStore = require('Main/pageStore');

function trackView() {
  window.analytics.trackView(pageStore.get());
}

var analyticsTracker = {
  onDeviceReady: function () {
    var analytics = window.analytics; // Not defined before the onDeviceReady event

    analytics.startTrackerWithId('UA-44093216-2');

    trackView();

    pageStore.addChangeListener(function() {
      trackView();
    });

    window.onerror = function(message, url, line) {
      analytics.trackException(message + '|' + url + '|' + line, true); // (Description, Fatal)
    };
  },
};

module.exports = analyticsTracker;
