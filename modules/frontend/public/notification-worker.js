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

    switch (event.action) {
        case 'open_url':
            clients.openWindow(event.notification.data.url); //which we got from above
            break;
    }
}
    , false);

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

