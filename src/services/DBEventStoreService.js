const service = {};
const listeners = [];

function pushIfActive(msg) {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(msg);
    }
}

const registerListener = (listenerFct) => {
    if (listenerFct instanceof Function) {
        listeners.push(listenerFct);
    } else {
        console.error("Listener added to DBEventStore is not a function !");
    }
};

const pushCreateEvent = (todoID) => pushIfActive({ ...todoID, action : "created" });
const pushUpdateEvent = (todoID) => pushIfActive({ ...todoID, action : "updated" });
const pushDeleteEvent = (todoID) => pushIfActive({ ...todoID, action : "deleted" });

service.pushCreateEvent = pushCreateEvent;
service.pushUpdateEvent = pushUpdateEvent;
service.pushDeleteEvent = pushDeleteEvent;
service.addDBChangedEventListener = registerListener;

// Once this Service is used it will register itself with the 'message' event on the serviceworker-container
navigator.serviceWorker.addEventListener('message', (msg) => {
    listeners.forEach((lstnr) => {
        lstnr(msg.data);
    });
});

export default service;