const CACHE_NAME = 'aziz2027-offline-v4';

const FILES_TO_CACHE = [
  './aziz2027.html',
  './generator.html',
  './activation.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const file of FILES_TO_CACHE) {
        try {
          await cache.add(file);
        } catch (e) {
          console.log('لم يتم تخزين:', file);
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });
          return response;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            const url = new URL(event.request.url);

            if (url.pathname.endsWith('/generator.html')) {
              return caches.match('./generator.html');
            }

            return caches.match('./aziz2027.html');
          }
        });
    })
  );
});
  

  
    
      
        
        
          
        
        
      
      
        
        

          
            
          
        
      
  

