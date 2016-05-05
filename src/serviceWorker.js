/* eslint-disable no-console */
import registerServiceWorker from 'serviceworker!./sw.js';

export default {
  install() {
    if (navigator.serviceWorker && window.location.protocol === 'https:') {
      registerServiceWorker({
        scope: '/',
      }).then((registration) => {
        console.log('ServiceWorker registration successful');
        console.log(registration);
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          registration.installing.addEventListener('statechange', () => {
            if (newWorker.state === 'activated' && !navigator.serviceWorker.controller) {
              // the very first activation!
              // tell the user stuff works offline
              console.log('sw onFirstLoad, ready to work offline');
            }

            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // We could ask the user to reload.
              console.log('sw onInstalled');
            }
          });
        });
      });
    }
  },
};
