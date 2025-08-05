const CACHE_NAME = 'dialysis-app-v7';
const urlsToCache = [
  'https://sanaeih1.github.io/Dialysis08/',
  'https://sanaeih1.github.io/Dialysis08/index.html',
  'https://sanaeih1.github.io/Dialysis08/manifest.json',
  'https://sanaeih1.github.io/Dialysis08/foods.json',
  'https://sanaeih1.github.io/Dialysis08/contact.html',
  'https://sanaeih1.github.io/Dialysis08/mums_logo.png',
  'https://sanaeih1.github.io/Dialysis08/assets/icon-512x512.png',
  'https://sanaeih1.github.io/Dialysis08/assets/icon-192x192.png',
  'https://sanaeih1.github.io/Dialysis08/assets/home.png',
  'https://sanaeih1.github.io/Dialysis08/assets/history.png',
  'https://sanaeih1.github.io/Dialysis08/assets/video.png',
  'https://sanaeih1.github.io/Dialysis08/assets/book.png',
  'https://sanaeih1.github.io/Dialysis08/assets/settings.png',
  'https://sanaeih1.github.io/Dialysis08/assets/info.png',
  'https://sanaeih1.github.io/Dialysis08/assets/back.png',
  'https://sanaeih1.github.io/Dialysis08/assets/trash-alt.png',
  'https://sanaeih1.github.io/Dialysis08/assets/food.png',
  'https://sanaeih1.github.io/Dialysis08/assets/search.png',
  'https://sanaeih1.github.io/Dialysis08/assets/list.png',
  'https://sanaeih1.github.io/Dialysis08/assets/weight.png',
  'https://sanaeih1.github.io/Dialysis08/assets/clock.png',
  'https://sanaeih1.github.io/Dialysis08/assets/plus.png',
  'https://sanaeih1.github.io/Dialysis08/assets/water-glass.png',
  'https://sanaeih1.github.io/Dialysis08/assets/water-drop.png',
  'https://sanaeih1.github.io/Dialysis08/assets/urine.png',
  'https://sanaeih1.github.io/Dialysis08/assets/trash.png',
  'https://sanaeih1.github.io/Dialysis08/assets/font-size.png',
  'https://sanaeih1.github.io/Dialysis08/assets/sodium.png',
  'https://sanaeih1.github.io/Dialysis08/assets/potassium.png',
  'https://sanaeih1.github.io/Dialysis08/assets/phosphorus.png',
  'https://sanaeih1.github.io/Dialysis08/assets/protein.png',
  'https://sanaeih1.github.io/Dialysis08/assets/water.png',
  'https://sanaeih1.github.io/Dialysis08/assets/save.png',
  'https://cdn.jsdelivr.net/npm/vazir-font@28.0.0/dist/font-face.css',
  'https://cdn.jsdelivr.net/npm/shabnam-font@5.0.0/dist/font-face.css',
  'https://cdn.jsdelivr.net/npm/persian-date@1.1.0/dist/persian-date.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://www.aparat.com/video/video/embed/videohash/vhf4z5z/vt/frame',
  'https://www.aparat.com/video/video/embed/videohash/hlqzdki/vt/frame',
  'https://www.aparat.com/video/video/embed/videohash/ifu44gz/vt/frame',
  'https://www.aparat.com/video/video/embed/videohash/lof5k6h/vt/frame',
  'https://www.aparat.com/video/video/embed/videohash/hjc3195/vt/frame',
  'https://www.aparat.com/video/video/embed/videohash/TUTORIAL123/vt/frame'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Cache failed to open or add resources:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  const isAparatVideo = requestUrl.origin === 'https://www.aparat.com' && requestUrl.pathname.includes('/video/video/embed');

  if (isAparatVideo && !navigator.onLine) {
    event.respondWith(
      new Response('<div class="offline-message">شما آفلاین هستید</div>', {
        headers: { 'Content-Type': 'text/html' }
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          })
          .catch(() => {
            return caches.match('https://sanaeih1.github.io/Dialysis08/index.html');
          });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      return self.clients.claim();
    })
  );
});