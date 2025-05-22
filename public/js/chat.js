console.debug("Chat script is executing");

import Push from "./push.js";

const push = new Push();

const sendButton = document.getElementById("sendMessage");
const printedMessagesIDs = [];
let lastUserName = null;

/**
 * Print all messages in the chat log
 */
function printMessages(triggerHaptics = true) {
    fetch("/api/messages")
        .then((res) => res.json())
        .then((messages) => {
            console.debug("Messages fetched");

            for (const message of messages) {
                if (!printedMessagesIDs.includes(message._id)) {
                    printedMessagesIDs.push(message._id);

                    const messageElement = document.createElement("div");
                    let content = "";

                    // Only print user name and timestamp if user changed
                    if (message.userName !== lastUserName) {
                        content += `<p><strong>${message.userName}</strong> <span style="font-size:0.8em;color:#888;">${message.timestamp}</span></p>`;
                    }

                    content += `<p>${message.content}</p>`;
                    messageElement.innerHTML = content;
                    chatBoxElement.appendChild(messageElement);

                    lastUserName = message.userName;

                    // Scroll to the bottom of the chat to show new messages
                    chatBoxElement.scrollTop = chatBoxElement.scrollHeight;

                    // Trigger haptic feedback
                    if (triggerHaptics && hasVibrationSupport()) {
                        navigator.vibrate(300);
                    } else {
                        console.debug(
                            "Vibration not supported, or triggerHaptics is false"
                        );
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
    // Send out a notification
    push.sendPushNotification(
        "Yapchat",
        parameters.get("displayName") || "Anonymous" + " - " + message
    );

    let parameters = new URLSearchParams(document.location.search);
    let timestamp = new Date();
    let minutes = timestamp.getMinutes();

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    let hours = timestamp.getHours();

    if (hours < 10) {
        hours = "0" + hours;
    }

    timestamp = `${hours}:${minutes}`;

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
