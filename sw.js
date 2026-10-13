
const CACHE_NAME = 'aziz2027-offline-v29';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './code-generator.html',
  './activation.js'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    for (const file of FILES_TO_CACHE) {
      try {
        const url = new URL(file, self.registration.scope);
        const response = await fetch(url, { cache: 'reload' });

        if (response.ok) {
          await cache.put(url.href, response);
        }
      } catch (error) {
        console.log('تعذر تخزين الملف:', file);
      }
    }

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    await Promise.all(
      keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith((async () => {
    const request = event.request;
    const indexURL = new URL(
      'index.html',
      self.registration.scope
    );

    const cached = await caches.match(request, {
      ignoreSearch: true
    });

    if (cached) return cached;

    if (request.mode === 'navigate') {
      const offlinePage = await caches.match(indexURL.href);

      if (offlinePage) return offlinePage;
    }

    try {
      const response = await fetch(request);

      if (response.ok &&
          new URL(request.url).origin === self.location.origin) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }

      return response;
    } catch (error) {
      const offlinePage = await caches.match(indexURL.href);

      if (offlinePage) return offlinePage;

      return new Response('لا يوجد اتصال بالإنترنت', {
        status: 503,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }
  })());
});

  
    
      

      
        
          
          
            
          
          
        
        
          
          

            
            
            

            
          
        
    
  

  

  
    
      
        
        
          
        
        
      
      
        
        

          
            
          
        
      
  

