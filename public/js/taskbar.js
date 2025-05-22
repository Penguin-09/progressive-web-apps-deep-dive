document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const startMenu = document.getElementById('startMenu');

  // Toggle menu when Start button is clicked
  startButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from bubbling
    startMenu.classList.toggle('hidden');
  });

  // Hide Start menu when clicking anywhere else
  document.addEventListener('click', (event) => {
    if (!startMenu.classList.contains('hidden')) {
      startMenu.classList.add('hidden');
    }
  });

  // Prevent menu from closing if you click inside it
  startMenu.addEventListener('click', (event) => {
    event.stopPropagation();
  });
});
