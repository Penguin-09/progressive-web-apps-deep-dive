console.debug("Chat script is executing");

fetch("/api/messages")
    .then((res) => res.json())
    .then((messages) => {
        console.debug("Messages fetched");

        const chatBoxElement = document.getElementById("chatLog");

        // Print message history
        for (const message of messages) {
            const messageElement = document.createElement("div");
            messageElement.innerHTML = `<p>${message.userName}</p><p>${message.content}</p>`;
            chatBoxElement.appendChild(messageElement);
        }
    })
    .catch((error) => {
        console.error("Error fetching messages:", error);
    });
