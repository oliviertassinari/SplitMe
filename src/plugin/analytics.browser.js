const analytics = {
  trackException(description, fatal) {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
    ga('send', 'exception', {
      exDescription: description,
      exFatal: fatal,
    });
  },
  trackView(page) {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
    ga('send', {
      hitType: 'pageview',
      page: page,
    });
  },
};

export default analytics;
