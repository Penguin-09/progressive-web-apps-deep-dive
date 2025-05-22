export default class Push {
    constructor(serviceWorkerRegistration) {
        // Check if the service worker exists and has a push manager
        this.pushManager = serviceWorkerRegistration.pushManager;
        if (!this.pushManager) {
            throw new Error("Service Worker Push Manager not available");
        }
        if (!("Notification" in window)) {
            throw new Error("Push notifications not supported in this browser");
        }
    }

    /**
     * Get the user's permission for push notifications
     * @returns {boolean} - wether the user granted permission
     */
    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            console.debug(`Notification permission: ${permission}`);

            const permissionState = await this.pushManager.permissionState({
                userVisibleOnly: true,
            });
            console.log("Notification permission state:", permissionState);

            return permission === "granted" && permissionState === "granted";
        } catch (error) {
            console.error(
                `Error requesting push notification permission: ${error}`
            );
            return false;
        }
    }

    /**
     * Subscribe the user to push notifications
     * @returns {PushSubscription} - the push subscription object
     */
    async subscribe() {
        // Get user permission
        const permissionGranted = await this.requestNotificationPermission();
        if (!permissionGranted) {
            console.error("Push notification permission is not granted");
            return;
        }

        // Get the subscription if the user has already subscribed
        const subscription = await this.pushManager.getSubscription();
        if (subscription) {
            console.log("Already subscribed to push notifications");
            return subscription;
        }

        // Otherwise, subscribe to push notifications
        try {
            const newSubscription = await this.registerForPushNotifications();
            console.log(
                "Successfully subscribed to push notifications: ",
                newSubscription
            );
            return newSubscription;
        } catch (error) {
            console.error(
                `Error subscribing to push notifications: ${error.message}`
            );
            return null;
        }
    }

    /**
     * Register the user for push notifications
     * @returns
     */
    async registerForPushNotifications() {
        const serverVAPIDKey = await this.getServerVAPIDKey();

        const subscription = await this.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: serverVAPIDKey,
        });

        console.log("Sending subscription to server...");

        // Send the subscription to the server
        return fetch("api/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(subscription),
        });
    }

    /**
     * Get the server VAPID key
     * @returns {Uint8Array} - the VAPID key
     */
    async getServerVAPIDKey() {
        const result = await fetch("/api/application-server-key");
        if (!result.ok) {
            throw new Error("Failed to fetch VAPID key");
        }

        const { applicationServerKey } = await result.json();
        return Push.urlBase64ToUint8Array(applicationServerKey);
    }

    /**
     * Convert the URL to an unsigned integer array
     * @param {*} base64String The string to be converted
     * @returns {Uint8Array} The converted string
     */
    static urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const rawData = atob(base64);
        return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
    }

    /**
     * Send the push notification
     */
    async sendPushNotification(notificationTitle, notificationBody) {
        const url = `/api/send-push-notification?title=${encodeURIComponent(notificationTitle)}&body=${encodeURIComponent(notificationBody)}`;
        const result = await fetch(url);
        const { sent, failed } = await result.json();
        console.log(`Push notification sent: ${sent}, failed: ${failed}`);
    }
}
