// Service Worker for Progressive Web App functionality
// Provides offline access, caching, and background sync

const CACHE_NAME = 'kb-workspace-v1.3';
const OFFLINE_URL = '/offline.html';

// Essential files to cache for offline functionality
const CORE_CACHE_FILES = [
  '/',
  '/index.html',
  '/links.html',
  '/about_me.html',
  '/helpful_tools.html',
  '/cool_visualizations.html',
  '/styles.css',
  '/scripts/accessibility_controls.js',
  '/scripts/enhanced_search.js',
  '/scripts/quick_access.js',
  '/scripts/keyboard_nav.js',
  '/scripts/typed_name.js',
  '/scripts/image_cycler.js',
  '/scripts/site_search.js',
  '/search_index.json',
  '/manifest.json',
  OFFLINE_URL
];

// Key tools that should work offline
const TOOLS_CACHE_FILES = [
  '/world_clock.html',
  '/focus_timer.html',
  '/random_generator.html',
  '/qr_code_generator.html',
  '/morse_translator.html',
  '/dice_roll.html',
  '/calculator.html',
  '/newsvendor.html'
];

// Visualizations that can work offline
const VIZ_CACHE_FILES = [
  '/clocks.html',
  '/math_sequences.html',
  '/fibonacci_spiral.html',
  '/pascal_triangle.html',
  '/sierpinski_triangle.html'
];

const ALL_CACHE_FILES = [...CORE_CACHE_FILES, ...TOOLS_CACHE_FILES, ...VIZ_CACHE_FILES];

// Install event - cache essential files
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching core files...');
        return cache.addAll(CORE_CACHE_FILES);
      })
      .then(() => {
        // Cache additional files in background
        return caches.open(CACHE_NAME)
          .then(cache => {
            console.log('Caching additional files...');
            return Promise.allSettled(
              [...TOOLS_CACHE_FILES, ...VIZ_CACHE_FILES].map(url =>
                cache.add(url).catch(err => console.warn(`Failed to cache ${url}:`, err))
              )
            );
          });
      })
      .then(() => {
        console.log('Service Worker installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Service Worker activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (except for fonts/CDN resources we might want to cache)
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    handleFetch(event.request)
  );
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Try cache first for core files
    if (isCoreFile(url.pathname)) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // Try network first for most requests
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      
      // Clone the response as it can only be consumed once
      const responseToCache = networkResponse.clone();
      
      // Cache strategy based on file type
      if (shouldCache(url.pathname)) {
        cache.put(request, responseToCache);
      }
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If it's an HTML page and not cached, return offline page
    if (request.headers.get('accept')?.includes('text/html')) {
      const offlineResponse = await caches.match(OFFLINE_URL);
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    // Return a basic response for other failed requests
    return new Response(
      JSON.stringify({ error: 'Content not available offline' }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

function isCoreFile(pathname) {
  return CORE_CACHE_FILES.some(file => 
    file === pathname || file === pathname + '.html'
  );
}

function shouldCache(pathname) {
  // Cache HTML files, CSS, JS, JSON, and images
  return pathname.match(/\.(html|css|js|json|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/i) ||
         pathname === '/' ||
         ALL_CACHE_FILES.includes(pathname);
}

// Background sync for when connectivity is restored
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-cache-update') {
    event.waitUntil(updateCacheInBackground());
  }
});

async function updateCacheInBackground() {
  console.log('Updating cache in background...');
  
  try {
    const cache = await caches.open(CACHE_NAME);
    
    // Update core files
    await Promise.allSettled(
      CORE_CACHE_FILES.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.status === 200) {
            await cache.put(url, response);
          }
        } catch (error) {
          console.warn(`Failed to update ${url} in background:`, error);
        }
      })
    );
    
    console.log('Background cache update complete');
  } catch (error) {
    console.error('Background cache update failed:', error);
  }
}

// Push notifications (for future newsletter updates)
self.addEventListener('push', event => {
  console.log('Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'New content available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('KB Workspace Update', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification click received.');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle app installation prompt
self.addEventListener('beforeinstallprompt', event => {
  console.log('PWA install prompt available');
  
  // Store the event for later use
  event.userChoice.then(choiceResult => {
    console.log('User choice:', choiceResult.outcome);
    
    // Analytics could go here
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  });
});

// Periodic background sync (experimental)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'content-sync') {
    event.waitUntil(updateCacheInBackground());
  }
});

// Share target (for receiving shared content)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHARE_TARGET') {
    console.log('Shared content received:', event.data);
    
    // Handle shared URLs, text, etc.
    // Could integrate with tools like QR code generator
    
    event.waitUntil(
      clients.openWindow('/qr_code_generator.html?text=' + encodeURIComponent(event.data.text || event.data.url || ''))
    );
  }
});

// Cleanup old data periodically
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEANUP_CACHE') {
    event.waitUntil(
      cleanupOldCache()
    );
  }
});

async function cleanupOldCache() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  
  // Remove old or unused entries (keep last 100 items)
  if (requests.length > 100) {
    const toDelete = requests.slice(0, requests.length - 100);
    await Promise.all(toDelete.map(request => cache.delete(request)));
    console.log(`Cleaned up ${toDelete.length} old cache entries`);
  }
}

console.log('Service Worker script loaded');
