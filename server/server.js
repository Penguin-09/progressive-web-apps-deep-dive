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

// Get messages
app.get("/api/messages", async (req, res) => {
    const collection = client.db("yapChat").collection("messages");
    const messages = await collection.find({}).toArray();
    res.json(messages);
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

        const notificationPayload = JSON.stringify({
            title: "Test notification",
            body: "Test notification content",
        });

        for (const subscription of subscriptions) {
            webpush
                .sendNotification(subscription, notificationPayload)
                .then((sendResult) => {
                    console.log(
                        `Notification sent to ${subscription.endpoint}: ${sendResult.statusCode}`
                    );
                })
                .catch((error) => {
                    console.error(
                        `Failed to send notification to ${subscription.endpoint}: ${error}`
                    );
                });
        }
    } catch (error) {
        console.error(error);
        response
            .status(500)
            .json({ error: "Failed to send test notifications" });
    }
});
