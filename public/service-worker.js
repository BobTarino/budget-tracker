const APP_PREFIX = "BudgetTracker-";
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./js/idb.js"
];

self.addEventListener('install', function (e) {
    e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        console.log('installing cache : ' + CACHE_NAME)
        return cache.addAll(FILES_TO_CACHE)
      })
    )
})

self.addEventListener('activate', function(e) {
    e.waitUntil(
      caches.keys().then(function(keyList) {
        let cacheKeeplist = keyList.filter(function(key) {
          return key.indexOf(APP_PREFIX);
        });
        cacheKeeplist.push(CACHE_NAME);
        // resolves once all old versions of the cache have been deleted
        return Promise.all(
          keyList.map(function(key, i) {
            //   will only return value of -1 if item is not found in keeplist
            if (cacheKeeplist.indexOf(key) === -1) {
              console.log('deleting cache : ' + keyList[i]);
              return caches.delete(keyList[i]);
            }
          })
        );
      })
    );
});

// application knows to retrieve info from cache
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    // intercept fetch request
    e.respondWith(
      caches.match(e.request).then(function (request) {
        return request || fetch(e.request)
      })
    )
})