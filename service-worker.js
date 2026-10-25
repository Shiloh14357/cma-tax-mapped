const CACHE_NAME = "tax-mapped-p15-v1";
const APP_FILES = [
  "./",
  "./index.html",
  "./tax-syllabus-explorer.html",
  "./past-papers.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./past-papers/CMA-Final-P15-Dec-2024.pdf",
  "./past-papers/CMA-Final-P15-June-2025.pdf",
  "./past-papers/CMA-Final-P15-Dec-2025.pdf",
  "./past-papers/CMA-Final-P15-June-2026.pdf"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); }
    return response;
  }).catch(() => event.request.mode === "navigate" ? caches.match("./index.html") : Response.error())));
});
