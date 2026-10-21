// Minimal service worker: makes the site installable. Network first; nothing is cached,
// so you always get the latest articles and edits.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
