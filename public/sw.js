/// Kashmir Grave Care — Service Worker v3
/// Strategies: Cache-first for static assets, network-first for pages,
/// stale-while-revalidate for images. Graceful offline fallback.

const CACHE_VERSION = "gck-v3";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGES_CACHE = `${CACHE_VERSION}-pages`;
const IMAGES_CACHE = `${CACHE_VERSION}-images`;
const FONTS_CACHE = `${CACHE_VERSION}-fonts`;

// App shell: pages that should be precached for offline access
const APP_SHELL_PAGES = [
  "/",
  "/services",
  "/about",
  "/work",
  "/contact",
  "/offline",
];

// Critical static assets to precache
const STATIC_ASSETS = [
  "/manifest.json",
  "/favicon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/images/logo.jpg",
];

// ─── INSTALL ───────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Precache static assets
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
      // Precache app shell pages (soft fail — pages may not be built yet in dev)
      caches.open(PAGES_CACHE).then((cache) =>
        cache.addAll(APP_SHELL_PAGES).catch(() => {
          // Individual page caching fallback
          return Promise.allSettled(
            APP_SHELL_PAGES.map((url) =>
              fetch(url).then((res) => {
                if (res.ok) cache.put(url, res);
              })
            )
          );
        })
      ),
    ])
  );
  // Activate immediately — don't wait for old tabs to close
  self.skipWaiting();
});

// ─── ACTIVATE ──────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !key.startsWith(CACHE_VERSION))
          .map((key) => caches.delete(key))
      )
    )
  );
  // Take control of all open tabs immediately
  self.clients.claim();
});

// ─── FETCH ─────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests from same origin
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // Route to appropriate strategy
  if (isPageRequest(request)) {
    event.respondWith(networkFirstWithOffline(request));
  } else if (isImageRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, IMAGES_CACHE));
  } else if (isFontRequest(url)) {
    event.respondWith(cacheFirst(request, FONTS_CACHE));
  } else if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else {
    event.respondWith(networkFirstFallback(request));
  }
});

// ─── MESSAGE HANDLER (for update signaling) ────────────
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ─── STRATEGIES ────────────────────────────────────────

/**
 * Network-first for HTML pages. Falls back to cache, then offline page.
 */
async function networkFirstWithOffline(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(PAGES_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Return offline page as last resort
    const offlinePage = await caches.match("/offline");
    if (offlinePage) return offlinePage;
    return new Response("Offline", { status: 503, headers: { "Content-Type": "text/html" } });
  }
}

/**
 * Cache-first for static assets and fonts (immutable or long-lived).
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    return new Response("", { status: 408 });
  }
}

/**
 * Stale-while-revalidate for images — serve from cache instantly,
 * update in background for next visit.
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

/**
 * Generic network-first with cache fallback (for misc same-origin requests).
 */
async function networkFirstFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await caches.match(request);
    return cached || new Response("", { status: 408 });
  }
}

// ─── HELPERS ───────────────────────────────────────────

function isPageRequest(request) {
  return request.mode === "navigate" || request.headers.get("accept")?.includes("text/html");
}

function isImageRequest(url) {
  return url.pathname.match(/\.(png|jpg|jpeg|webp|avif|gif|svg|ico)$/i) ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/_next/image");
}

function isFontRequest(url) {
  return url.pathname.match(/\.(woff|woff2|ttf|otf|eot)$/i);
}

function isStaticAsset(url) {
  return url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(js|css|json)$/i);
}
