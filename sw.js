// Service worker = un petit programme qui garde les fichiers du jeu en mémoire.
// Résultat : le jeu s'ouvre même sans connexion internet.
const NOM = 'cible-v1';   // si tu modifies le jeu, change en 'cible-v2' pour forcer la mise à jour
const FICHIERS = [
  './', 'index.html', 'manifest.json',
  'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'
];

// À l'installation : on copie tous les fichiers dans le cache
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(NOM).then(function (cache) { return cache.addAll(FICHIERS); }));
  self.skipWaiting();
});

// À l'activation : on supprime les anciennes versions du cache
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (noms) {
      return Promise.all(noms.filter(function (n) { return n !== NOM; }).map(function (n) { return caches.delete(n); }));
    })
  );
  self.clients.claim();
});

// À chaque demande de fichier : on répond avec le cache, sinon avec internet
self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (rep) { return rep || fetch(event.request); }));
});
