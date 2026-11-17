// Caché para uso sin conexión. La versión cambia sola cuando cambian los archivos.
const CACHE = "sv-ficha-qr-5c707047-plano";
const ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "qrcode.js", "jspdf.umd.min.js", "zxing-reader.js", "zxing_reader.wasm", "barlow-condensed-latin-700-normal.woff2", "barlow-latin-400-normal.woff2", "barlow-latin-500-normal.woff2", "barlow-latin-600-normal.woff2", "barlow-latin-700-normal.woff2", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // Red primero para la página (toma las actualizaciones); caché si no hay conexión.
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put("./", cp)); return r; })
      .catch(() => caches.match("./").then(r => r || caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
