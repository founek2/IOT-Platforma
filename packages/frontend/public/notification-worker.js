self.addEventListener("push", event => {
    const { title, ...options } = event.data.json();
    console.log("recieved notification title")
    const promiseChain = self.registration.showNotification(
        title, // title of the notification
        options,
    );

    event.waitUntil(promiseChain);
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});