/// <reference lib="webworker" />

self.addEventListener("push", event => {
    const { title, click_action, ...options } = event.data.json();
    console.log("recieved notification title")
    const promiseChain = self.registration.showNotification(
        title, // title of the notification
        {
            ...options,
            data: { url: click_action }, //the url which we gonna use later
            actions: [{ action: "open_url", title: "Zobrazit" }]
        },
    );

    event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function (event) {
    console.log("On notification click: ", event.notification.data);
    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
        clients
            .matchAll({
                includeUncontrolled: true,
                type: "window",
            })
            .then((clientList) => {
                for (const client of clientList) {
                    if ("focus" in client)
                        client.focus();

                    client.postMessage({
                        action: 'redirect-from-notificationclick',
                        url: event.notification.data.url,
                    })
                    return;
                }
                if (clients.openWindow) return clients.openWindow(event.notification.data.url);
            }),
    );
}, false);

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Handle refresh
self.addEventListener(
    "pushsubscriptionchange",
    (event) => {
        console.log("handling pushs ubscription change")
        const conv = (val) =>
            btoa(String.fromCharCode.apply(null, new Uint8Array(val)));

        const getPayload = (subscription) => ({
            endpoint: subscription.endpoint,
            publicKey: conv(subscription.getKey("p256dh")),
            authToken: conv(subscription.getKey("auth")),
        });

        const subscription = self.registration.pushManager
            .subscribe(event.oldSubscription.options)
            .then((subscription) =>
                fetch(self.location.origin + "/api/pushsubscriptionchange", {
                    method: "patch",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        formData: {
                            MODIFY_PUSH_SUBSCRIPTION: {
                                old: getPayload(event.oldSubscription),
                                new: getPayload(subscription),
                            }
                        }
                    }),
                }),
            );
        event.waitUntil(subscription);
    },
    false,
);

