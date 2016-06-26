/* globals ga */

const analytics = {
  trackView(page) {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
    ga('set', 'page', page);
    ga('send', 'pageview');
  },
  trackEvent(category, action, label, value) {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
    ga('send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value,
    });
  },
};

export default analytics;
