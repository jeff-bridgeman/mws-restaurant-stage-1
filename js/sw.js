let staticCacheName = 'THECACHE'


self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(staticCacheName).then(function(cache) {
        return cache.addAll([
          'js/main.js',
          'css/main.css',
          'css/responsive.css',
        ]);
      })
    );
  });


