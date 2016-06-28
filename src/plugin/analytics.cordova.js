import config from 'config';
let isReady = false;
let queue = [];

function handleQueue() {
  if (!isReady) {
    return;
  }

  for (let i = 0; i < queue.length; i++) {
    const action = queue[i];

    switch (action.type) {
      case 'trackException':
        /**
         * Doc for Android
         * https://developers.google.com/analytics/devguides/collection/android/v4/exceptions
         */
        window.analytics.trackException(action.payload.description, action.payload.fatal); // description up to 100
        break;

      case 'trackView':
        window.analytics.trackView(action.payload.page);
        break;
    }
  }

  queue = [];
}

function onDeviceReady() {
  window.analytics.startTrackerWithId(config.googleAnalytics);
  isReady = true;
  handleQueue();
}

document.addEventListener('deviceready', onDeviceReady, false);

const analytics = {
  trackView(page) {
    queue.push({
      type: 'trackView',
      payload: {
        page: page,
      },
    });
    handleQueue();
  },
};

export default analytics;
