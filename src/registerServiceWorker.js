// This makes webpack load the service-worker-file without further touching it
/* eslint import/no-webpack-loader-syntax: off */
import swURL from 'file-loader?name=[name].[ext]!./serviceworker/worker.js'
import swServices from 'file-loader?name=[name].[ext]!./serviceworker/workerServices.js'
import mlabKey from 'file-loader?name=[name].[ext]!./serviceworker/mlab.key.js'
import dexie from 'file-loader?name=[name].[ext]!../node_modules/dexie/dist/dexie.js'

export default function register() {
  if ('serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebookincubator/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      // Do not remove reference to swURL and swServices since otherwise they are optimized away
      // and the file-loader stops working here
      console.log("Service-Worker Scripts "+swURL+" / "+swServices+" / "+mlabKey+" / "+dexie);
      registerValidSW(swURL);
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = (e) => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and
              // the fresh content will have been added to the cache.
              // It's the perfect time to display a "New content is
              // available; please refresh." message in your web app.
              console.log('New content is available; please refresh.');
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
