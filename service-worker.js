'use strict';

const CACHE_NAME = 'my-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/images/logo.png', // Add other assets as necessary
];

// Install service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app assets...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate service worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event for caching and serving requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request) // Check cache
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse; // Return cached response
                }
                return fetch(event.request) // Fetch from network
                    .then((response) => {
                        return caches.open(CACHE_NAME) // Cache the response
                            .then((cache) => {
                                cache.put(event.request, response.clone());
                                return response; // Return the network response
                            });
                    });
            })
    );
});