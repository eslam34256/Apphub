/* AppHub Service Worker (v31) — app shell بسيط وآمن:
   - ما نكاشش /api خالص (داتا حية)
   - صفحات HTML: network-first مع fallback للهوم المحفوظة (offl أوفلاين)
   - أصول ثابتة (_next/static, أيقونات): cache-first بتجديد هادئ
*/
const SHELL = "apphub-shell-v1";
const STATIC = "apphub-static-v1";
const PRECACHE = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => ![SHELL, STATIC].includes(k)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/")) return; // داتا حية — ممنوع التخزين

  // أصول ثابتة: cache-first
  if (url.pathname.startsWith("/_next/static/") || /\.(png|jpg|webp|svg|woff2?)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then((hit) => {
        const net = fetch(e.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(STATIC).then((c) => c.put(e.request, clone));
          }
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // صفحات: network-first، أوفلاين → الهوم
  if (e.request.headers.get("accept")?.includes("text/html")) {
    e.respondWith(
      fetch(e.request).catch(() =>
        caches.match(e.request).then((hit) => hit || caches.match("/"))
      )
    );
  }
});
