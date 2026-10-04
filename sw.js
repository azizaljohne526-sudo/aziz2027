const CACHE_NAME = 'aziz2027-offline-v7';

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
    (async () => {
      const url = new URL(event.request.url);

      if (event.request.mode === 'navigate') {
        if (url.pathname.endsWith('/generator.html')) {
          const cachedGenerator = await caches.match('./generator.html', {
            ignoreSearch: true
          });
          if (cachedGenerator) return cachedGenerator;
        } else {
          const cachedApp = await caches.match('./aziz2027.html', {
            ignoreSearch: true
          });
          if (cachedApp) return cachedApp;
        }
      }

      const cached = await caches.match(event.request, {
        ignoreSearch: true
      });

      if (cached) return cached;

      try {
        const response = await fetch(event.request);
        const copy = response.clone();
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, copy);
        return response;
      } catch (e) {
        return Response.error();
      }
    })()
  );
});
  

  
    
      

      
        
          
          
            
          
          
        
        
          
          

            
            
            

            
          
        
    
  

  

  
    
      
        
        
          
        
        
      
      
        
        

          
            
          
        
      
  

