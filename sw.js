// Versiunea se schimbă la fiecare deploy — forțează refresh automat
const CACHE_VERSION = 'v' + Date.now();
const CACHE_NAME = 'cabinet-app-' + CACHE_VERSION;

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activează imediat fără să aștepte tab-uri închise
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k))) // Șterge TOATE cache-urile vechi
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('railway.app') || 
      event.request.url.includes('supabase.co')) return;

  // Network first — mereu versiunea nouă
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
