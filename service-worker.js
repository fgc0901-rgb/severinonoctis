// Service Worker básico para cache estático
const CACHE_NAME = 'severino-v3';
const ASSETS = [
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'imagens/simbolo.png',
  'data/personagem.json',
  'data/eventos.json',
  'data/itens.json',
  'data/atualizacoes.json',
  'imagens/rdr2/rdr2.json'
];

// Lista de extensões alvo para cache runtime (RDR2 capturas)
const RDR2_RUNTIME_EXT = ['.webp', '.jpg', '.png'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(()=>{}))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Navegação: tenta rede, cai para index.html
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.open(CACHE_NAME).then(c => c.match('index.html')))
    );
    return;
  }
  // Runtime caching para imagens RDR2
  const isRdr2Image = url.pathname.startsWith('/imagens/rdr2/') && RDR2_RUNTIME_EXT.some(ext => url.pathname.endsWith(ext));
  if (isRdr2Image) {
    e.respondWith(
      caches.open(CACHE_NAME).then(cache => 
        cache.match(e.request).then(found => {
          if (found) return found;
          return fetch(e.request).then(resp => {
            if (resp.ok) cache.put(e.request, resp.clone());
            return resp;
          });
        })
      )
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
