this.importScripts("dexie.js");
this.importScripts("mlab.key.js");  // ToDo remove this
this.importScripts("workerServices.js");

// Create DB Wrapper around IndexDB for ToDo-Items 
/* eslint no-undef: off */
const db = new Dexie("ToDoDatabase"); 
db.version(1).stores({
    toDoStore: "_id,state"
});
const servicesPromise=db.open()
  .then(() => {
    const services = workerServices({ mlabKey : mlab_api_key, fetch , db });
    services.fetchPending().then((pending) => {
        console.log("pending ... "+ JSON.stringify(pending));
    });

    console.log("opened db ");
    return services;
  }) 
  .catch(function (e) {
    console.error("Open failed: " + e);
  });

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

    servicesPromise.then((services) => {
        services.fetchPending().then((pending) => {
            console.log("pending : "+JSON.stringify(pending));
            pending.forEach((p) => services.syncPending(p).catch(console.log));
        });
    });

})
