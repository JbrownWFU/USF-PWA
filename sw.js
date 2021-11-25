
//Offline default response if for some reason the cached offline index.html does not load
var offlineResponse = "<html>" + "<body>" + "<style>" + "body{text-align: center; background-color: #555; color#fff;}" + "</style>" + "<h1>Welcome To The New News</h1>" + "<p>It looks like you are offline, please check your network and retry</p>" + "</body>" + "</html>"

self.addEventListener('fetch', function(event){
    event.respondWith(
        fetch(event.request).catch(function() {
            return new Response (
                offlineResponse, {headers:{"Content-Type":"text/html"}}
            );
        })
    
        );
    });

//Caching function below - utilizing cache falling back to network with freqeunt updates

var CACHE_NAME = "News_cache_v1";
var CACHED_URLS = [
    //html  ->        CSS ->               Images ->
    "/index.html", "/CSS/Styles.css", "/IMG/globe.png", "/IMG/camel.jpg", "/IMG/matrix.webp", "/IMG/stocks.jpg", "/IMG/tua.jpg"
];

self.addEventListener ('install' , function(event) { //Install event for SW
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(CACHED_URLS);
        
        })
    );
});

self.addEventListener('fetch', function(event) { //Fetch event for SW
    console.log(event.request.url);
    var REQUESTING_URL = new URL(event.request.url);
    if(REQUESTING_URL.pathname === "/" || REQUESTING_URL.pathname === "/index.html") { //If the requested file is in the root directory OR is index.html, return the cached file or the network version
        event.respondWith(Caches.open(CACHE_NAME).then(function(cache) {
            return cache.match("/index.html").then(function(cachedResponse) {
                var fetchPromise = fetch("/index.html").then(function(networkResponse) {
                    cache.put("/index.html", networkresponse.clone());
                    return networkResponse;
                });
            return cachedResponse || fetchPromise;
        });
    })

 );
} else if( CACHED_URLS.includes(REQUESTING_URL.href) || CACHED_URLS.includes(REQUESTING_URL.pathname) ){ //test if file is in cache, if so return newly cached file, if not return network file
    event.respondWith(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                return response || fetch(event.request);
            });
        })
    );
}
});

       
self.addEventListener("activate", function(event) { //activate function for SW
    event.waitUntil(caches.keys().then(function(cacheNames)
 {
     return Promise.all(cacheNames.map(function(cacheName)

    {
        if(CACHE_NAME !== CacheName && CacheName.startsWith("News_cache")) {
            return caches.delete(cacheName);
        }
     })
     );
 })
);
});   


