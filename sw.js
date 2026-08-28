const CACHE_NAME = 'pak-digital-store-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/nadra.html',
  '/numbers.html',
  '/ai.html',
  '/funds.html',
  '/history.html',
  '/profile.html',
  '/about.html',
  '/admin.html',
  '/pak-digital.store.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => Promise.all(
      ASSETS.map((url) => cache.add(url).catch(() => null))
    ))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('firebase') || event.request.url.includes('firestore') || event.request.url.includes('lovable.app')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
