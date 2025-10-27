const staticCacheName = 'site-static-v1';
const assets = [
  './', // Кешируем корень для офлайн-доступа
  'index.html',
  'app.js',
  'images/icon.png',
  'css/style.css',
  'images/icons/icon_128.png',
  'images/icons/icon_192.png'
];

// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      return cache.addAll(assets); // Добавляем return, чтобы Promise разрешился
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName) // Используем !== вместо !=
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
    
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request); // Возвращаем результат fetch()
    })
  );
});