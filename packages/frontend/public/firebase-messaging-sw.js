if ("function" === typeof importScripts) {
	importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
	importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

	firebase.initializeApp({
		apiKey: "AIzaSyAfTP6OW7kywc0uKCN0FWj6abMTpuEEGlo",
		authDomain: "iot-platforma-v3.firebaseapp.com",
		projectId: "iot-platforma-v3",
		storageBucket: "iot-platforma-v3.appspot.com",
		messagingSenderId: "749063380950",
		appId: "1:749063380950:web:7b44e715ee4bb0338b4e77",
	});

	var messaging = firebase.messaging();
	messaging.setBackgroundMessageHandler(function (payload) {
		console.log("[firebase-messaging-sw.js] Received background message ", payload);
		// Customize notification here
		const notificationTitle = "Background Message Title";
		const notificationOptions = {
			body: "Background Message body.",
			icon: "/firebase-logo.png",
		};

		return self.registration.showNotification(notificationTitle, notificationOptions);
	});
}
