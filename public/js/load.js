  window.addEventListener("load", () => {
    const loadingScreen = document.getElementById("loading-screen");
    setTimeout(() => {
      loadingScreen.classList.add("opacity-0");
      setTimeout(() => loadingScreen.remove(), 500);
    }, 2600);
  });