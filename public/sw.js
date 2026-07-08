const CACHE_NAME = "gck-v2";
const PRECACHE_URLS = [
  "/",
  "/services",
  "/about",
  "/work",
  "/contact",
  "/images/logo.jpg",
  "/images/kashmir-cemetery.png",
  "/images/grave-before-final.jpg",
  "/images/grave-after-final.jpg",
];

// Install: precache core pages and assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback — SAME-ORIGIN GET requests only.
// Never cache cross-origin requests (Supabase API, fonts, external media).
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // let the browser handle it

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful same-origin responses only
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cached) => {
          return cached || caches.match("/");
        });
      })
  );
});
