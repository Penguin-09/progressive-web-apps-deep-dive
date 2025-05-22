console.log("Service Worker is executing");

// Installation trigger
self.addEventListener("install", (event) => {
    console.log("[Service Worker] Install event triggered");
});

// Activation trigger
self.addEventListener("activate", (event) => {
    console.log("[Service Worker] Activate event triggered");
});

self.addEventListener("push", (event) => {
    const { title, body } = event.data.json();
    console.log("[Service Worker] Push event triggered");

    self.registration.showNotification(title, { body });
});
