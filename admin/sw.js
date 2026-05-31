/* Admin dashboard service worker.
   - Shell assets: cache-first (instant loads, full offline).
   - CDN assets (fonts, Font Awesome, Chart.js): stale-while-revalidate.
   - Config/API JSON: never cached, always fresh from the network. */
const SHELL_CACHE = 'admin-shell-v2';
const CDN_CACHE   = 'admin-cdn-v1';
const SHELL = ['./', './index.html', './admin.css', './admin.js', './icon.svg', './manifest.webmanifest'];
const CDN_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== SHELL_CACHE && k !== CDN_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Config / API responses must stay fresh — let them hit the network directly.
  if (url.pathname.endsWith('.json')) return;

  // CDN assets: serve cached instantly, refresh in the background.
  if (CDN_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.open(CDN_CACHE).then(c => c.match(e.request).then(hit => {
        const net = fetch(e.request).then(res => { c.put(e.request, res.clone()).catch(() => {}); return res; }).catch(() => hit);
        return hit || net;
      }))
    );
    return;
  }

  // Other cross-origin (GitHub API, GoatCounter, PageSpeed): pass straight through.
  if (url.origin !== self.location.origin) return;

  // Same-origin shell: cache-first, with an offline fallback for navigations.
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(SHELL_CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined)))
  );
});
