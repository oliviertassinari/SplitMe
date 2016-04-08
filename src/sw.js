/**
 * When the user navigates to your site,
 * the browser tries to redownload the script file that defined the service worker in the background.
 * If there is even a byte's difference in the service worker file compared to what it currently has,
 * it considers it 'new'.
 */

const CACHE_NAME = 'cache-v';
const urlsToCache = [
  '/',
];

// install: when the service worker is first added to a computer
self.addEventListener('install', (event) => {
  // Perform install steps

  event.waitUntil(() => {
    // Add core website files to cache during serviceworker installation
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    });
  });
});


self.addEventListener('fetch', (event) => {
  const request = event.request;

  // This service worker won't touch non-get requests
  if (request.method !== 'GET') {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          // Cache hit - return response
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response2) => {
          // Check if we received a valid response2
          // Basic means from the origin
          if (!response2 || response2.status !== 200 || response2.type !== 'basic') {
            return response2;
          }

          const responseToCache = response2.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response2;
        });
      }
    )
  );
});

// After the install event
self.addEventListener('activate', () => {

});
