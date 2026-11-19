// Service worker: makes the app work offline after the first visit.
// App shell (HTML, manifest, icon) is fetched fresh when online and saved for offline use; weather requests go to the
// network, and the app falls back to the forecast saved in localStorage when offline.
const CACHE = "almanac-v9";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg",
  "./data.js",
  "./us-zips.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;

  // Weather API: network only; the page handles failure with the saved forecast.
  if (url.hostname === "api.open-meteo.com") return;

  // App shell: network first, so a connected browser always gets the newest page.
  // Falls back to the saved copy when offline.
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(event.request, copy));
          }
          return res;
        })
        .catch(() => caches.match(event.request)),
    );
  }
});
