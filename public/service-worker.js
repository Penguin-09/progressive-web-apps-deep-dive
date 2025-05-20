console.log("Service Worker is executing");

// Installation trigger
self.addEventListener("install", (event) => {
    console.log("[Service Worker] Install event triggered");
});

// Activation trigger
self.addEventListener("activate", (event) => {
    console.log("[Service Worker] Activate event triggered");
});
