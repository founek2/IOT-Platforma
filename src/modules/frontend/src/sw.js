
if ("function" === typeof importScripts) {

  importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");
  importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js');
  importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js');

  // Global workbox
  if (workbox) {

    console.log("Workbox is loaded");

    // Disable logging
    workbox.setConfig({ debug: false });


    //`generateSW` and `generateSWString` provide the option
    // to force update an exiting service worker.
    // Since we're using `injectManifest` to build SW,
    // manually overriding the skipWaiting();
    self.addEventListener("install", event => {
      // self.skipWaiting();
      // window.location.reload();
    });

    self.addEventListener('message', function (event) {
      if (event.data.action === 'skipWaiting') {
        console.log("Skipping waiting")
        self.skipWaiting();
      }
    });


    // The event listener that is fired when the service worker updates
    // Here we reload the page
    // navigator.serviceWorker.addEventListener('controllerchange', function () {

    // });

    // Manual injection point for manifest files.
    // All assets under build/ and 5MB sizes are precached.
    workbox.precaching.precacheAndRoute([]);

    // Font caching
    workbox.routing.registerRoute(
      new RegExp("https://fonts.(?:.googlepis|gstatic).com/(.*)"),
      workbox.strategies.cacheFirst({
        cacheName: "googleapis",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 30
          })
        ]
      })
    );

    // Image caching
    workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg|svg)$/,
      workbox.strategies.cacheFirst({
        cacheName: "images",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
          })
        ]
      })
    );

    // JS, CSS caching
    workbox.routing.registerRoute(
      /\.(?:js|css)$/,
      workbox.strategies.staleWhileRevalidate({
        cacheName: "static-resources",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 20 * 24 * 60 * 60 // 20 Days
          })
        ]
      })
    );

    firebase.initializeApp({
      apiKey: "AIzaSyD15CUfT9PGQNok0qcs4qu2ectuauAYwWw",
      authDomain: "iot-platforma-v2.firebaseapp.com",
      databaseURL: "https://iot-platforma-v2.firebaseio.com",
      projectId: "iot-platforma-v2",
      storageBucket: "iot-platforma-v2.appspot.com",
      messagingSenderId: "2726593509",
      appId: "1:2726593509:web:67c7b307fdf98f6973a50c"
    })

    var messaging = firebase.messaging();
    messaging.setBackgroundMessageHandler(function (payload) {
      console.log('[firebase-messaging-sw.js] Received background message ', payload);
      // Customize notification here
      const notificationTitle = 'Background Message Title';
      const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
      };

      return self.registration.showNotification(notificationTitle,
        notificationOptions);
    });

  } else {
    console.error("Workbox could not be loaded. No offline support");
  }
}