'use strict';

var pageStore = require('./Main/pageStore');

var analytics = window.analytics;

function trackView() {
  analytics.trackView(pageStore.get());
}

var analyticsTracker = {
  onDeviceReady: function () {
    analytics.startTrackerWithId('UA-44093216-2');

    trackView();

    pageStore.addChangeListener(function() {
      trackView();
    });
  },
};

module.exports = analyticsTracker;
