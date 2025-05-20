console.debug("Start Script is executing");

const formElement = document.querySelector("form");

if (formElement) {
    formElement.addEventListener("submit", (event) => {
        event.preventDefault();

        const displayName = document.getElementById("displayName").value;

        // Redirect to chat page
        window.location.replace("chat.html?displayName=" + displayName);
    });
} else {
    console.error("Form element not found");
}
