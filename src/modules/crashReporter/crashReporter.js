// @flow weak

import raven from 'raven-js';
import config from 'config';

const SENTRY_DSN = 'https://158e30e6e71f4421a552ec04ab91e442@app.getsentry.com/83549';

function sendQueue() {
  const sentryOffline = JSON.parse(window.localStorage.sentryOffline);

  if (sentryOffline.length > 0) {
    raven._send(sentryOffline[0]);
  }
}

const crashReporter = {
  init: () => {
    if (!window.localStorage.sentryOffline) {
      window.localStorage.sentryOffline = '[]';
    }

    raven.config(SENTRY_DSN, {
      release: process.env.VERSION,
      environment: process.env.NODE_ENV, // Should always be production
      tags: {
        configName: config.name,
        platform: process.env.PLATFORM,
      },
      dataCallback: (data) => { // Called before sending the report.
        let state = data.extra.state;

        if (state && !data.extra.retry) {
          // Prevent from sending too much data.
          state = state.setIn(['account', 'accounts', 'payload'], null);

          return {
            ...data,
            extra: {
              ...data.extra,
              state: state.toJS(),
            },
          };
        } else {
          return data;
        }
      },
    });

    if (process.env.NODE_ENV === 'production') {
      raven.install();
    }

    document.addEventListener('ravenFailure', ({data}) => {
      // Only store it once.
      if (!data.extra.retry) {
        // Mutation with side effect.
        data.extra.retry = true;

        const sentryOffline = JSON.parse(window.localStorage.sentryOffline);
        // We can't store too much data
        if (sentryOffline.length < 10) {
          sentryOffline.push(data); // We use a FIFO.
          window.localStorage.sentryOffline = JSON.stringify(sentryOffline);
        }
      }
    });

    document.addEventListener('ravenSuccess', ({data}) => {
      if (data.extra.retry === true) {
        const sentryOffline = JSON.parse(window.localStorage.sentryOffline);
        sentryOffline.shift(); // We use a FIFO.
        window.localStorage.sentryOffline = JSON.stringify(sentryOffline);
      }

      // The last push succeded, let's try to clear the queue.
      sendQueue();
    });

    // First load, let's try to clear the queue.
    sendQueue();
  },
  setExtraContext: (context) => {
    // Extra data is limited to 100 items, and each item is capped at 512 bytes.
    raven.setExtraContext(context);
  },
  captureBreadcrumb: (options) => {
    raven.captureBreadcrumb(options);
  },
  captureException: (err) => {
    raven.captureException(err);
  },
};

export default crashReporter;
