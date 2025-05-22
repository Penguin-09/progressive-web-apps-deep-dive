import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

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
