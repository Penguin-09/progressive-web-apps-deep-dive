import express from "express";
import cors from "cors";
import webpush from "web-push";
import { MongoClient } from "mongodb";

// Give web-push vapid details
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        "mailto:contact@snevver.nl",
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
} else {
    console.error("VAPID keys not found");
}

// Connect to MongoDB
const app = express();
const PORT = process.env.PORT ?? 6789;
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

app.use(cors());
app.use(express.json());
app.use(express.static("../public"));

// Get the latest 50 messages
app.get("/api/messages", async (req, res) => {
    const collection = client.db("yapChat").collection("messages");
    const messages = await collection
        .find()
        .sort({ timestamp: -1 })
        .limit(50)
        .toArray();
    res.json(messages.reverse());
});

app.listen(PORT, () => {
    console.debug(`Server running at http://localhost:${PORT}`);
});

// Post new message
app.post("/api/messages", async (req, res) => {
    const newMessage = req.body;
    const collection = client.db("yapChat").collection("messages");
    const result = await collection.insertOne(newMessage);
    res.status(201).json(result);
});

// Provide public VAPID key
app.get("/api/application-server-key", (request, response) => {
    response.json({ applicationServerKey: process.env.VAPID_PUBLIC_KEY });
});

/**
 * Store a new subscription in the database
 */
app.post("/api/subscribe", async (request, response) => {
    try {
        const subscription = request.body;

        const subscriptionsCollection = client
            .db("yapChat")
            .collection("subscriptions");

        await subscriptionsCollection.insertOne(subscription);
        console.log("New subscription added to database");
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Failed to store subscription" });
    }
});

app.get("/api/send-push-notification", async (request, response) => {
    try {
        const subscriptionsCollection = client
            .db("yapChat")
            .collection("subscriptions");

        const subscriptions = await subscriptionsCollection.find().toArray();

        const notificationTitle = request.query.title;
        const notificationBody = request.query.body;
        // Set the icon to the favicon
        const notificationPayload = JSON.stringify({
            title: notificationTitle,
            body: notificationBody,
        });

        let sent = 0;
        let failed = 0;

        for (const subscription of subscriptions) {
            try {
                await webpush.sendNotification(
                    subscription,
                    notificationPayload,
                );
                sent++;
            } catch (error) {
                failed++;
                // Remove invalid subscriptions
                if (
                    error.statusCode === 410 || // Gone
                    error.statusCode === 404 // Not Found
                ) {
                    await subscriptionsCollection.deleteOne({
                        endpoint: subscription.endpoint,
                    });
                    console.log(
                        `Removed invalid subscription: ${subscription.endpoint}`,
                    );
                }
                console.error(
                    `Failed to send notification to ${subscription.endpoint}: ${error}`,
                );
            }
        }
        response.json({ sent, failed });
    } catch (error) {
        console.error(error);
        response
            .status(500)
            .json({ error: "Failed to send test notifications" });
    }
});
