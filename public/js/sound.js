 // Create an audio object for the click sound
  const clickSound = new Audio('sounds/click.wav');

  // Get all buttons on the page
  const buttons = document.querySelectorAll('button');

  // Add click event listener to each button
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Play the click sound
      clickSound.currentTime = 0; // Rewind to start
      clickSound.play();
    });
  });