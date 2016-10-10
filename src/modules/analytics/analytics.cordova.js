// @flow weak

import warning from 'warning';
import config from 'config';

let isReady = false;
let queue = [];

const TRACK_VIEW = 'trackView';
const TRACK_TIMING = 'trackTiming';

function handleQueue() {
  if (!isReady) {
    return;
  }

  for (let i = 0; i < queue.length; i += 1) {
    const {
      type,
      payload,
    } = queue[i];

    switch (type) {
      case TRACK_VIEW:
        window.analytics.trackView(payload.page);
        break;

      case TRACK_TIMING:
        window.analytics.trackTiming(payload.category, payload.duration, payload.metric);
        break;

      default:
        break;
    }
  }

  queue = [];
}

document.addEventListener('deviceready', () => {
  window.analytics.startTrackerWithId(config.googleAnalytics);
  isReady = true;
  handleQueue();
}, false);

const analytics = {
  trackView(page) {
    queue.push({
      type: TRACK_VIEW,
      payload: {
        page,
      },
    });
    handleQueue();
  },
  trackEvent() {
  },
  trackTiming(category, metric, duration) {
    warning(duration === parseInt(duration, 10), 'The duration should be an integer');

    queue.push({
      type: TRACK_TIMING,
      payload: {
        category,
        metric,
        duration,
      },
    });
    handleQueue();
  },
};

export default analytics;
