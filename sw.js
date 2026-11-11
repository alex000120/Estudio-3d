// Versión de la caché: subila cuando cambies la lista SHELL o la estrategia.
const V = 'estudio3d-v1';
const SHELL = ['./', 'index.html', 'css/estilos.css', 'js/app.js', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// La página y su código: primero la red (así llegan los cambios), y si no hay conexión, la copia guardada.
// Modelos, sonidos, clips y librerías externas: primero la copia guardada (no se vuelven a bajar).
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const shell = url.origin === self.location.origin && /\.(html|js|css|json)$|\/$/.test(url.pathname) || url.pathname.endsWith('/');
  e.respondWith((async () => {
    const c = await caches.open(V);
    if (shell) {
      try {
        const res = await fetch(req);
        if (res.ok) c.put(req, res.clone());
        return res;
      } catch (err) {
        const hit = await c.match(req, { ignoreSearch: true });
        if (hit) return hit;
        throw err;
      }
    }
    const hit = await c.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok || res.type === 'opaque') c.put(req, res.clone());
    return res;
  })());
});
