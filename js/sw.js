var staticCache='restaurant-static-content';
var photoCache='restaurant-photo-content';
var allCaches = [
  staticCache,
  photoCache
];

self.addEventListener('fetch', function(event){
  console.log(event.request);
});

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(staticCache).then((cache) => {
        return cache.addAll([
          '/',
          'js/main.js',
          'js/dbhelper.js',
          'css/main.css',
          'css/responsive.css',
          'restaurant.html',
        ]).catch(error => {
          console.log(error);
        });
      })
    );
  });


  self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            return cacheName.startsWith('restaurant-') &&
                   !allCaches.includes(cacheName);
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });

  self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);
    console.log('WHAT WHAT');

    if (requestUrl.origin === location.origin) {
      if (requestUrl.pathname.startsWith('/img/')) {
        event.respondWith(servePhoto(event.request));
        return;
      }
    }

    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });

  function servePhoto(request) {
    var storageUrl = request.url.replace(/-\d+px\.jpg$/, '');

    return caches.open(photoCache).then(function(cache) {
      return cache.match(storageUrl).then(function(response) {
        if (response) return response;

        return fetch(request).then(function(networkResponse) {
          cache.put(storageUrl, networkResponse.clone());
          return networkResponse;
        });
      });
    });
  }