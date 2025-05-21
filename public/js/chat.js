console.debug("Chat script is executing");

const sendButton = document.getElementById("sendMessage");
const printedMessagesIDs = [];

/**
 * Print all messages in the chat log
 */
function printMessages() {
    fetch("/api/messages")
        .then((res) => res.json())
        .then((messages) => {
            console.debug("Messages fetched");

            // Print message history
            for (const message of messages) {
                console.log(message._id);
                if (!printedMessagesIDs.includes(message._id)) {
                    printedMessagesIDs.push(message._id);

                    const messageElement = document.createElement("div");
                    messageElement.innerHTML = `<p>${message.userName}</p><p>${message.content}</p>`;
                    chatBoxElement.appendChild(messageElement);
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

    await fetch("/api/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: message,
            userName: parameters.get("displayName") || "Anonymous",
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
        printMessages();
        await new Promise((resolve) => setTimeout(resolve, 3000));
    }
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

refreshChat();
