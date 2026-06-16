const CACHE_NAME = "agro-monitor-v6";

// Al instalar: cachear el shell de la app
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(["/", "/index.html"]).catch(() => {})
    )
  );
  self.skipWaiting();
});

// Al activar: limpiar cachés viejos
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first para assets de la app, network-only para Supabase
self.addEventListener("fetch", (e) => {
  // No interceptar POST/PATCH/PUT/DELETE
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);

  // Supabase: siempre red (nunca cachear datos)
  if (url.hostname.includes("supabase.co")) return;

  // Assets de la app: cache-first con fallback a red, guardando en caché
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
          // Sin red: devolver index.html para que React maneje la ruta
          if (e.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});

// Mensaje desde la app para forzar actualización
self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});
