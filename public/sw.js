// Open Agents - Service Worker
// Caches built static assets only. Never caches provider responses or anything containing keys or prompts.

const CACHE_NAME = 'open-agents-static-v1'

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/favicon.svg',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
]

const DISALLOWED_HOSTNAMES = [
  'api.openai.com',
  'api.anthropic.com',
  'generativelanguage.googleapis.com',
  'openrouter.ai',
  'api.groq.com',
  'api.mistral.ai',
  'api.cohere.ai',
  'supabase.co',
]

/**
 * Determine if a request should strictly bypass the service worker cache.
 * Security rule: Never cache provider responses or anything containing keys or prompts.
 */
function shouldBypassCache(request, url) {
  // Only GET requests are ever cached (inference and completion calls are POST)
  if (request.method !== 'GET') {
    return true
  }

  // Only http(s) protocols
  if (!url.protocol.startsWith('http')) {
    return true
  }

  // Never cache requests to AI providers or external APIs
  const hostname = url.hostname.toLowerCase()
  if (DISALLOWED_HOSTNAMES.some((blocked) => hostname.includes(blocked))) {
    return true
  }

  // Never cache paths that look like API endpoints or auth/prompts
  const pathname = url.pathname.toLowerCase()
  if (
    pathname.includes('/api/') ||
    pathname.includes('/v1/') ||
    pathname.includes('/chat/') ||
    pathname.includes('/completions') ||
    pathname.includes('/models')
  ) {
    return true
  }

  // Never cache requests carrying credentials, auth tokens, or API keys
  if (
    request.headers.has('authorization') ||
    request.headers.has('x-api-key') ||
    request.headers.has('api-key')
  ) {
    return true
  }

  // Never cache the service worker itself
  if (pathname === '/sw.js') {
    return true
  }

  // Strict rule: Service worker caches built static assets only (same-origin)
  if (url.origin !== self.location.origin) {
    return true
  }

  return false
}

function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/assets/') ||
    PRECACHE_ASSETS.includes(pathname) ||
    /\.(?:js|css|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|webmanifest|json)$/i.test(pathname)
  )
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (shouldBypassCache(event.request, url)) {
    return
  }

  // Navigation requests: Network-First falling back to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', clone))
          }
          return response
        })
        .catch(() => {
          return caches.match('/index.html').then((cached) => cached || caches.match('/'))
        })
    )
    return
  }

  // Built static assets: Cache-First falling back to network
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(event.request).then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse
          }
          const responseToCache = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
          return networkResponse
        })
      })
    )
  }
})
