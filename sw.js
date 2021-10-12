self.addEventListener('fetch', function(event){
    event.respondWith(
        fetch(event.request).catch(function() {
            return new Response (
                "Welcome to the news\n" + "Looks like you are offline\n"
            );
        })
    
        );
    });




self.addEventListener ('install' , function(event) {
    event.waitUntil(
        caches.open('newsCache').then(function(cache) {
            return cache.addAll(

            ['/offline.html', '/index.html', '/CSS/Styles.css']

            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log(event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
