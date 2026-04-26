/**
 * INF.02 Study Hub — Service Worker
 * Owner: Builder-PWA (BPWA)
 * Per ADR-006 (REVISED Checkpoint 1): PWA P0 artifact.
 * Cache strategy:
 *   - cache-first for shell.html, quiz.html, diagnostic.html, practical.html, srs.html,
 *     manifest.webmanifest, icons/*, Chart.js CDN (ADR-002)
 *   - network-first (with cache fallback) for data/*.json
 * CACHE_VERSION sourced from contracts/design-tokens.json -> pwa.cacheVersion = "v3.0.0".
 * NO direct localStorage usage in this file (constraint).
 */

const CACHE_VERSION = 'inf02-v3.2.0';

const ASSETS = [
  './shell.html',
  './quiz.html',
  './diagnostic.html',
  './practical.html',
  './srs.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  '../data/questions.json',
  '../data/scenarios.json',
  'https://cdn.jsdelivr.net/npm/chart.js@4.5.0/dist/chart.umd.js'
];

// ---------------------------------------------------------------------------
// install — pre-cache wszystkich assets z whitelist
// ---------------------------------------------------------------------------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      // addAll fails atomically; loguj błędy ale nie crash całego install
      return Promise.all(
        ASSETS.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch((err) => {
            // eslint-disable-next-line no-console
            console.warn('[SW] install: skipped asset', url, err && err.message);
          })
        )
      );
    })
  );
  // Aktywuj nową wersję natychmiast (update flow steruje shell.html)
  self.skipWaiting();
});

// ---------------------------------------------------------------------------
// activate — usuń stare cache versions
// ---------------------------------------------------------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_VERSION)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ---------------------------------------------------------------------------
// fetch — routing strategy
// ---------------------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1) Network-first dla data/*.json (świeże pytania jeśli sieć dostępna)
  if (url.pathname.includes('/data/') && url.pathname.endsWith('.json')) {
    event.respondWith(networkFirst(req));
    return;
  }

  // 2a) Network-first dla HTML (aktualizacje muszą być natychmiast widoczne)
  if (url.pathname.endsWith('.html')) {
    event.respondWith(networkFirst(req));
    return;
  }

  // 2b) Cache-first dla static assets z whitelist (icons / manifest / Chart.js CDN)
  if (isCachedAsset(url, req.url)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // 3) Pozostałe — passthrough z opportunistic cache fallback
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
function isCachedAsset(url, fullUrl) {
  // Chart.js CDN
  if (fullUrl.indexOf('chart.umd.js') !== -1) return true;
  // Same-origin assets
  return ASSETS.some((a) => {
    if (a.startsWith('http')) return fullUrl === a;
    // a starts with './'
    const tail = a.slice(2); // drop './'
    return url.pathname.endsWith('/' + tail) || url.pathname.endsWith(tail);
  });
}

function cacheFirst(req) {
  return caches.match(req).then((cached) => {
    if (cached) return cached;
    return fetch(req)
      .then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, clone));
        }
        return res;
      })
      .catch(() => cached); // last resort
  });
}

function networkFirst(req) {
  return fetch(req)
    .then((res) => {
      if (res && res.status === 200) {
        const clone = res.clone();
        caches.open(CACHE_VERSION).then((c) => c.put(req, clone));
      }
      return res;
    })
    .catch(() => caches.match(req));
}

// ---------------------------------------------------------------------------
// message — update detection / SKIP_WAITING bridge dla shell.html
// ---------------------------------------------------------------------------
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data === 'SKIP_WAITING' || event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data === 'GET_VERSION' || event.data.type === 'GET_VERSION') {
    if (event.source && event.source.postMessage) {
      event.source.postMessage({ type: 'VERSION', version: CACHE_VERSION });
    }
  }
});
