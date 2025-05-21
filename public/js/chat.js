console.debug("Chat script is executing");

const sendButton = document.getElementById("sendMessage");
const printedMessagesIDs = [];

/**
 * Print all messages in the chat log
 */
function printMessages(triggerHaptics = true) {
    fetch("/api/messages")
        .then((res) => res.json())
        .then((messages) => {
            console.debug("Messages fetched");

            // Print message history
            for (const message of messages) {
                if (!printedMessagesIDs.includes(message._id)) {
                    printedMessagesIDs.push(message._id);

                    const messageElement = document.createElement("div");
                    messageElement.innerHTML = `<p><strong>${message.userName}</strong></p><p>${message.timestamp}</p><p>${message.content}</p>`;
                    chatBoxElement.appendChild(messageElement);

                    // Trigger haptic feedback
                    if (triggerHaptics && hasVibrationSupport()) {
                        navigator.vibrate(300);
                    } else {
                        console.debug("Vibration not supported");
                    }
                }
            }
        })
        .catch((error) => {
            console.error("Error fetching messages:", error);
        });
}

/**
 * Send a user message to the database
 * @param {string} message The message to send
 */
async function sendMessage(message = "Error, user message not found") {
    let parameters = new URLSearchParams(document.location.search);
    let timestamp = new Date();
    timestamp = `${timestamp.getHours()}:${timestamp.getMinutes()}`;

    await fetch("/api/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: message,
            userName: parameters.get("displayName") || "Anonymous",
            timestamp: timestamp,
        }),
    });
    console.debug("Message sent");

    printMessages();
}

/**
 * Reload messages every 3 seconds
 */
async function refreshChat() {
    while (true) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        printMessages();
    }
}

/**
 * Check if the device supports vibration
 * @returns {boolean} True if the device supports vibration
 */
function hasVibrationSupport() {
    return "vibrate" in navigator;
}

const chatBoxElement = document.getElementById("chatLog");

// Clear existing messages
chatBoxElement.innerHTML = "";

sendButton.addEventListener("click", (event) => {
    event.preventDefault();
    const messageInput = document.getElementById("userMessage");
    sendMessage(messageInput.value);
    messageInput.value = "";
});

printMessages(false);
refreshChat();
