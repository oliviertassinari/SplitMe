/* eslint-disable no-console */

import runtime from '../ServiceWorkerWepbackPlugin/runtime';
import registerEvents from '../ServiceWorkerWepbackPlugin/browser/registerEvents';

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
    onUpdating: () => {
      console.log('onUpdating');
    },
    onUpdateFailed: () => {
      console.log('onUpdateFailed');
    },
    onUpdated: () => {
      console.log('onUpdated');
    },
  });
}
