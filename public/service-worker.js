const CACHE_NAME = "agro-monitor-v10";

// Archivos mínimos que SIEMPRE se pre-cachean para que la app cargue offline
const CORE = ["/", "/index.html", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. Cachear archivos core — esto SIEMPRE tiene que funcionar
      await Promise.allSettled(CORE.map((url) => cache.add(url).catch(() => {})));

      // 2. Cachear todos los assets del build (JS, CSS, etc.) desde asset-manifest.json
      try {
        const r = await fetch("/asset-manifest.json");
        if (r.ok) {
          const manifest = await r.json();
          const assets = Object.values(manifest.files || {}).filter(
            (u) => !u.endsWith(".map") && !u.endsWith(".txt")
          );
          await Promise.allSettled(assets.map((url) => cache.add(url).catch(() => {})));
        }
      } catch (_) { /* sin conexión durante install — los assets se cachean dinámicamente */ }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  // Borrar caches viejos, pero NO bloquear la activación
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

  // Supabase: dejar pasar sin cache (siempre en línea)
  if (url.hostname.includes("supabase.co")) return;
  // Otros dominios externos (CDN de imágenes, etc.): dejar pasar
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then(async (cached) => {
      // Cache hit → devolver inmediatamente y actualizar en background
      if (cached) {
        fetch(e.request)
          .then((res) => {
            if (res && res.status === 200) {
              caches.open(CACHE_NAME).then((c) => c.put(e.request, res.clone()));
            }
          })
          .catch(() => {});
        return cached;
      }

      // Cache miss → intentar red
      try {
        const res = await fetch(e.request);
        if (res && res.status === 200 && res.type !== "opaque") {
          caches.open(CACHE_NAME).then((c) => c.put(e.request, res.clone()));
        }
        return res;
      } catch (_) {
        // Sin red y sin cache → para navegación devolver index.html (la app maneja el offline)
        if (e.request.mode === "navigate") {
          const fallback = await caches.match("/index.html");
          if (fallback) return fallback;
        }
        // Para assets sin cache y sin red → no hay respuesta (el browser mostrará error de recurso)
        return new Response("", { status: 503, statusText: "Offline" });
      }
    })
  );
});

self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});
