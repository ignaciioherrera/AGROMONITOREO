const CACHE_NAME = "agro-monitor-v8";

self.addEventListener("install", (e) => {
  e.waitUntil(
    fetch("/asset-manifest.json")
      .then((r) => r.json())
      .then((manifest) => {
        const allUrls = Object.values(manifest.files || {}).filter(
          (u) => !u.endsWith(".map")
        );
        const urlsToCache = ["/", "/index.html", ...allUrls];
        return caches.open(CACHE_NAME).then((cache) =>
          Promise.allSettled(urlsToCache.map((url) => cache.add(url)))
        );
      })
      .catch(() => {
        return caches.open(CACHE_NAME).then((cache) =>
          cache.addAll(["/", "/index.html"]).catch(() => {})
        );
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.hostname.includes("supabase.co")) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request)
        .then((res) => {
          if (!res || res.status !== 200 || res.type === "opaque") return res;
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
          return res;
        })
        .catch(() => {
          if (e.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});

self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});
