// @flow weak

const analytics = {
  trackView(page) {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
    window.ga('set', 'page', page);
    window.ga('send', 'pageview');
  },
  trackEvent(category, action, label, value) {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
    window.ga('send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value,
    });
  },
};

export default analytics;
