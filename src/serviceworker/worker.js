async function install() {
    const cache = await caches.open("todo-v1");
    return cache.addAll(['/','/manifest.json','/favicon.ico','/static/js/app.js','/static/media/todo.svg']);
}

async function respond({ request }) {
    const cache = await caches.open("todo-v1");
    const cachedResponse = await cache.match(request);

    this.clients.matchAll().then((clientList) => {
        clientList.forEach((client) => {
            client.postMessage("a message from a serviceworker");
            console.log("posted a message");
        }); 
    });

    if (cachedResponse) {
        return cachedResponse;
    } 
    return fetch(request);
}

this.addEventListener('install', (evt) => {
     evt.waitUntil(install());
})

this.addEventListener('fetch', (evt) => {
    evt.respondWith(respond(evt));
})

this.addEventListener('message', ({ data }) => {
    console.log("Worker received message payload "+JSON.stringify(data));
})
