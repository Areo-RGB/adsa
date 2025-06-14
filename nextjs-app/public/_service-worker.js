// Basic service worker for PWA functionality
const CACHE_NAME = 'qv-app-v1'
const urlsToCache = [
  '/',
  '/home',
  '/styles/bootstrap.css',
  '/styles/style.css',
  '/styles/custom.css',
  '/fonts/css/fontawesome-all.min.css'
]

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached resource if available, otherwise fetch from network
        if (response) {
          return response
        }
        return fetch(event.request)
      }
    )
  )
})