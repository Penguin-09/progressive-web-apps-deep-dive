console.debug("Chat script is executing");

import Push from "./push.js";

let push;
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
            push = new Push(registration);
        })
        .catch((error) => {
            console.error("Service Worker registration failed:", error);
        });
} else {
    console.error("Service workers are not supported in this browser.");
}

const sendButton = document.getElementById("sendMessage");
const printedMessagesIDs = [];
let lastUserName = null;
let isReplying = false;
let replyMessageId = null;

const chatBoxElement = document.getElementById("chatLog");

// Predefined bright colors
const brightColors = [
    "#E53935", // Red
    "#D81B60", // Pink
    "#8E24AA", // Purple
    "#3949AB", // Blue
    "#1E88E5", // Light Blue
    "#00ACC1", // Cyan
    "#43A047", // Green
    "#FDD835", // Yellow
    "#FB8C00", // Orange
    "#6D4C41", // Brown
];

// Load saved user colors from localStorage or create empty object
let userColors = JSON.parse(localStorage.getItem("userColors") || "{}");

/**
 * Assign a bright color to a user or return the saved one
 * @param {string} userName
 * @returns {string} color in hex
 */
function getUserColor(userName) {
    if (userColors[userName]) {
        return userColors[userName];
    }

    // Find colors already used
    const usedColors = new Set(Object.values(userColors));

    // Pick first bright color not used yet
    let availableColor = brightColors.find((color) => !usedColors.has(color));

    // If all colors are used, just pick a random one from the list
    if (!availableColor) {
        availableColor =
            brightColors[Math.floor(Math.random() * brightColors.length)];
    }

    userColors[userName] = availableColor;
    localStorage.setItem("userColors", JSON.stringify(userColors));
    return availableColor;
}

/**
 * Print all messages in the chat log
 */
function printMessages(triggerHaptics = true) {
    // Remove the unnecessary parameters
    fetch("/api/messages")
        .then((res) => res.json())
        .then((messages) => {
            if (messages.length > 50) {
                messages = messages.slice(-50);
            }

            for (const message of messages) {
                if (!printedMessagesIDs.includes(message._id)) {
                    printedMessagesIDs.push(message._id);

                    const userColor = getUserColor(message.userName);

                    const messageElement = document.createElement("div");
                    let messageId = message._id;
                    let content = "";

                    // Only print user name and timestamp if user changed
                    if (message.userName !== lastUserName) {
                        content += `<p class="userName"><strong style="color:${userColor}">${message.userName}</strong> <span style="font-size:0.8em;color:#888;">${message.timestamp}</span></p>`;
                    }

                    // Check if the message is a reply
                    if (message.replyMessageId) {
                        const replyToMessage = messages.find(
                            (msg) => msg._id === message.replyMessageId
                        );
                        if (replyToMessage) {
                            content += `<p style="color:#888;">➥ Replying to ${replyToMessage.userName}: <span style="color:#333;">${replyToMessage.content}</span></p>`;
                        }
                    }

                    // Add the message content
                    content += `<p id="msg-${message._id}" class="message-content">${message.content}</p>`;

                    messageElement.innerHTML = content;
                    chatBoxElement.appendChild(messageElement);

                    // Try to play sound
                    try {
                        const balloonSound = new Audio("sounds/balloon.wav");
                        balloonSound.play();
                    } catch (e) {
                        console.log("Sound couldn't be played", e);
                    }

                    // Use a safe selector for the message <p> by id
                    const msgP = messageElement.querySelector(`p[id="msg-${message._id}"]`);
                    if (msgP) {
                        msgP.addEventListener("click", (event) => {
                            // Update the global variables
                            isReplying = true;
                            replyMessageId = messageId;

                            // Show reply preview
                            replyPreview.innerHTML = "";
                            replyPreview.appendChild(closeBtn);
                            replyPreview.style.display = "block";
                            replyPreview.innerHTML += `<div><strong>Replying to ${message.userName}:</strong> <span style="color:#888;">${message.content}</span></div>`;

                            console.log(
                                "Reply mode activated",
                                isReplying,
                                replyMessageId
                            );
                        });
                    }

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

            // Call after messages are rendered
            styleUsernames();
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

    if (message.length < 1) {
        console.error("Message is empty");
        return;
    }

    if (message.length > 300) {
        console.error("Message is too long");
        return;
    }
    // Wait for push to be defined before using it
    if (push) {
        let parameters = new URLSearchParams(document.location.search);
        const userName = parameters.get("displayName") || "Anonymous";
        await push.sendPushNotification(userName, message);
    }

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

    const body = {
        content: message,
        userName: parameters.get("displayName") || "Anonymous",
        timestamp: timestamp,
        isReplying: isReplying,
        replyMessageId: replyMessageId,
    };

    await fetch("/api/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    console.debug("Message sent");

    // Reset reply state after sending
    isReplying = false;
    replyMessageId = null;
    replyPreview.style.display = "none";
    replyPreview.innerHTML = "";
    replyPreview.appendChild(closeBtn);

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

/**
 * Add margin-top to all username elements for whitespace above
 */
function styleUsernames() {
    document.querySelectorAll(".userName").forEach((el) => {
        el.style.marginTop = "1rem";
    });
}

// Clear existing messages
chatBoxElement.innerHTML = "";

// Reply preview UI
const replyPreview = document.createElement("div");
replyPreview.id = "replyPreview";
replyPreview.style.display = "none";
replyPreview.style.background = "#f0f0f0";
replyPreview.style.padding = "6px 10px";
replyPreview.style.marginBottom = "6px";
replyPreview.style.borderLeft = "4px solid #888";
replyPreview.style.fontSize = "0.9em";
replyPreview.style.color = "#333";
replyPreview.style.position = "relative";
replyPreview.style.width = "100%";
replyPreview.style.boxSizing = "border-box";

// Close button
const closeBtn = document.createElement("span");
closeBtn.textContent = "×";
closeBtn.id = "replyCloseBtn";
closeBtn.style.position = "absolute";
closeBtn.style.right = "8px";
closeBtn.style.top = "2px";
closeBtn.style.cursor = "pointer";
closeBtn.style.fontWeight = "bold";
document.addEventListener("click", function (event) {
    if (event.target && event.target.id === "replyCloseBtn") {
        console.log("Close button clicked");
        isReplying = false;
        replyMessageId = null;
        replyPreview.style.display = "none";
        replyPreview.innerHTML = "";
        replyPreview.appendChild(closeBtn);
    }
});
replyPreview.appendChild(closeBtn);

// Insert replyPreview into the replyContainer div
const replyContainer = document.querySelector(".replyContainer");
if (replyContainer) {
    replyContainer.appendChild(replyPreview);
    replyContainer.style.width = "100%";
    replyContainer.style.display = "block";
    replyContainer.style.marginBottom = "0";
}

// Make sure the form uses flex-col
const chatForm = document.querySelector("form");
if (chatForm) {
    chatForm.style.display = "flex";
    chatForm.style.flexDirection = "column";
    chatForm.style.gap = "0.5rem";
    chatForm.style.alignItems = "stretch";
}

sendButton.addEventListener("click", (event) => {
    event.preventDefault();
    const messageInput = document.getElementById("userMessage");
    console.log(
        "Send button clicked",
        messageInput.value,
        isReplying,
        replyMessageId
    );
    sendMessage(messageInput.value);
    messageInput.value = "";
});

printMessages(false);
refreshChat();
