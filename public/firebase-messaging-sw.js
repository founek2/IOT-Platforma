if ("function" === typeof importScripts) {
    importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

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

}
