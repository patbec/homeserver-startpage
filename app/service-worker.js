self.addEventListener("install", (event) => {
    event.waitUntil(async () => {
        const cache = await caches.open("pwa-assets");

        return cache.addAll(
            [
                "/",
                "/index.html", // Check if needed
                "/favicon.svg",
                "/style/site.css",
                "/images/bookmark.png",
                "/images/icon-grafana.svg",
                "/images/icon-home-assistant.svg",
                "/images/icon-hoppscotch.png",
                "/images/icon-node-red.svg",
                "/images/icon-portainer.svg",
                "/images/icon-sinedo.svg",
                "/images/icon-syncthing.svg",
                "/images/icon-zigbee2mqtt.png",
                "/images/mask.svg",
                "/fonts/roboto-latin-100-normal.woff2",
                "/fonts/roboto-latin-300-normal.woff2",
                "/fonts/roboto-latin-400-normal.woff2",
                "/fonts/roboto-latin-500-normal.woff2",
                "/fonts/roboto-latin-700-normal.woff2",
                "/fonts/roboto-latin-900-normal.woff2",
            ]
        );
    });
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const networkFetch = fetch(event.request).then(response => {
                // update the cache with a clone of the network response
                caches.open("pwa-assets").then(cache => {
                    cache.put(event.request, response.clone());
                });
            });
            // prioritize cached response over network
            return cachedResponse || networkFetch;
        }
        )
    )
});