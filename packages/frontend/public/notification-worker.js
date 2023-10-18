self.addEventListener("push", e => {
    const { title, ...options } = e.data.json();
    console.log("recieved notification title")
    self.registration.showNotification(
        title, // title of the notification
        options,
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});