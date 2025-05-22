console.debug("Main Script is executing");

import Push from "./push.js";

// let deferredPrompt;

// // Listen for the beforeinstallprompt event
// window.addEventListener("beforeinstallprompt", (event) => {
//     console.debug("Install prompt ready to be triggered");

//     event.prompt();
// });

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

                const push = new Push(registration);
                push.subscribe();
            })
            .catch((error) => {
                console.error("Service Worker registration failed: ", error);
            });
    });
}
