document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // === INDEX PAGE LOGIC ===
  if (path.includes("index")) {
    const form = document.getElementById("form");
    form?.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("displayName").value;
      const color = document.getElementById("userColor").value;
      localStorage.setItem("displayName", name);
      localStorage.setItem("userColor", color);
      localStorage.setItem("transitionFromIndex", "true");

      const windowBox = document.querySelector(".max-w-md");
      windowBox.classList.add("animate-minimize");

      setTimeout(() => {
        window.location.href = "chat.html";
      }, 400);
    });
  }

  // === CHAT PAGE LOGIC ===
  if (path.includes("chat")) {
    const shouldAnimate = localStorage.getItem("transitionFromIndex") === "true";
    if (shouldAnimate) {
      const chatWindow = document.querySelector(".max-w-md");
      chatWindow.classList.add("animate-maximize");
      localStorage.removeItem("transitionFromIndex");
    }
  }
});
