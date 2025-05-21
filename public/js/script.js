console.debug("Main Script is executing");

let deferredPrompt;

// Listen for the beforeinstallprompt event
window.addEventListener("beforeinstallprompt", (event) => {
    console.debug("Install prompt ready to be triggered");

    deferredPrompt = event;

    // Trigger prompt a second time
    setTimeout(() => {
        deferredPrompt.prompt();
    }, 2000);
});

// Register service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {
                console.log(
                    "Service Worker registered with scope: ",
                    registration.scope
                );
            })
            .catch((error) => {
                console.error("Service Worker registration failed: ", error);
            });
    });
}
