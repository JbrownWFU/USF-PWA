

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


self.addEventListener ('install' , function(event) {
    event.waitUntil(
        caches.open('newsCache').then(function(cache) {
            return cache.addAll(

            ['/index.html', '/CSS/Styles.css', '/IMG/']

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