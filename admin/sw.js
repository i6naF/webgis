/* Admin dashboard service worker — offline shell caching.
   Network-first for config/API so data stays fresh; cache-first for the shell. */
const CACHE = 'admin-shell-v1';
const SHELL = ['./index.html', './admin.css', './admin.js', './icon.svg', './manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Never cache cross-origin (GitHub API, GoatCounter, PageSpeed) or config files.
  if (url.origin !== self.location.origin || url.pathname.endsWith('.json')) return;
  // Cache-first for our own shell assets.
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
