window.addEventListener("load", () => {
    const loadingScreen = document.getElementById("loading-screen");
      const startupSound = new Audio("sounds/startup.wav");
    setTimeout(() => {
      loadingScreen.classList.add("opacity-0");
      startupSound.play();
      setTimeout(() => loadingScreen.remove(), 500);
    }, 2500);
  });