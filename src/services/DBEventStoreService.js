const service = {};
const listeners = [];

function pushIfActive(msg) {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(msg);
    }
}

const registerListener = (listenerFct) => {
    console.log("registering ...");
    if (listenerFct instanceof Function) {
        listeners.push(listenerFct);
    } else {
        console.error("Listener added to DBEventStore is not a function !");
    }
};

const pushCreateEvent = () => {};
const pushUpdateEvent = () => {};
const pushDeleteEvent = () => {};

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