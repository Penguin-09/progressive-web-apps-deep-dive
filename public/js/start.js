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

document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Store display name and color (optional logic)
  const name = document.getElementById("displayName").value;
  const color = document.getElementById("userColor").value;
  localStorage.setItem("displayName", name);
  localStorage.setItem("userColor", color);

  // Set transition flag
  localStorage.setItem("transitionFromIndex", "true");

  // Animate minimize effect
  const windowBox = document.querySelector(".max-w-md");
  windowBox.classList.add("animate-minimize");

  // Wait for animation, then go to chat
  setTimeout(() => {
    window.location.href = "chat.html";
  }, 500);
});
