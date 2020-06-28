import * as firebase from 'firebase/app';
import 'firebase/messaging';
import initConfig from './config'

let messaging;

export function init() {
    const app = firebase.initializeApp(initConfig);
    messaging = app.messaging();

    messaging.onTokenRefresh(token => {
        console.log("token changed: ", token)
    })

    // Handle incoming messages. Called when:
    // - a message is received while the app has focus
    // - the user clicks on an app notification created by a service worker
    //   `messaging.setBackgroundMessageHandler` handler.
    messaging.onMessage((payload) => {
        console.log('Message received. ', payload);
        // TODO - show notification
    });
}

// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
export function getToken() {
    return messaging.getToken().then((currentToken) => {
        if (currentToken) {
            return currentToken
        } return null
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        return null
    });
}

