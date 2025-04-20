// This is an empty Service Worker to prevent 404 errors
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

// We don't implement caching or offline functionality
// This file only exists to prevent 404 errors in the console
