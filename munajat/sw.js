const C = 'munajat-v26', SHELL = ['./', 'index.html', 'app.js?v=26', 'data.js?v=26', 'manifest.json', 'icon.svg'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(C).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
const keep = (req, r) => { if (r && (r.ok || r.type === 'opaque')) { const cp = r.clone(); caches.open(C).then((c) => c.put(req, cp)); } return r; };
self.addEventListener('fetch', (e) => { const u = new URL(e.request.url); if (e.request.method !== 'GET') return;
  const font = /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (u.origin !== location.origin && !font) return;
  // ফন্ট: আগে ক্যাশ; অ্যাপের ফাইল: আগে নেট (নতুন সংস্করণ সাথে সাথে), নেট না থাকলে ক্যাশ
  if (font) { e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((r) => keep(e.request, r)))); return; }
  e.respondWith(fetch(e.request, {cache: 'no-cache'}).then((r) => keep(e.request, r)).catch(() => caches.match(e.request).then((hit) => hit || caches.match('index.html')))); });
