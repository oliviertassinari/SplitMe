/* eslint-disable no-console */

import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import registerEvents from 'serviceworker-webpack-plugin/lib/browser/registerEvents';

if ('serviceWorker' in navigator) {
  const registration = runtime.register({
    scope: '/', // Use the root.
  });

  registerEvents(registration, {
    onInstalled: () => {
      console.log('onInstalled');
    },
    onUpdateReady: () => {
      console.log('onUpdateReady');
    },
  });
}
