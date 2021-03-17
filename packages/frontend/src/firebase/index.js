import firebase from "firebase/app";
import "firebase/messaging";
import initConfig, { vapidKey } from "./config";

let messaging;

export function init() {
	const app = firebase.initializeApp(initConfig);
	if (!firebase.messaging.isSupported()) {
		console.log("Firebase messaging is not supported");
		return;
	}

	messaging = app.messaging();

	messaging.onTokenRefresh((token) => {
		console.log("token changed: ", token);
	});

	// Handle incoming messages. Called when:
	// - a message is received while the app has focus
	// - the user clicks on an app notification created by a service worker
	//   `messaging.setBackgroundMessageHandler` handler.
	messaging.onMessage((payload) => {
		// console.log('Message received. ', payload);
		// TODO - show notification
		console.log("onMessage");
		if (!("Notification" in window)) console.log("Notification not supported");
		else if (Notification.permission === "granted") {
			// If it's okay let's create a notification
			const {
				notification: { title, body, icon },
			} = payload;
			new Notification(title, { body, icon });
		}
	});
}

// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
export function getToken() {
	if (!messaging) return null;

	return messaging
		.getToken({
			vapidKey: vapidKey,
		})
		.then((currentToken) => (currentToken ? currentToken : null))
		.catch((err) => {
			console.log("An error occurred while retrieving token. ", err);
			return null;
		});
}
