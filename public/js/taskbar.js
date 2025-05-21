      const chatLog = document.getElementById('chatLog');
      const chatForm = document.getElementById('chatForm');
      const userMessage = document.getElementById('userMessage');

      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const messageText = userMessage.value.trim();
        if (messageText === '') return;

        const messageEl = document.createElement('p');
        messageEl.textContent = messageText;
        messageEl.className =
          'slide-in-left bg-[#f0f0f0] border border-black p-1 rounded-sm max-w-[80%]';

        chatLog.appendChild(messageEl);
        chatLog.scrollTop = chatLog.scrollHeight;

        userMessage.value = '';
        userMessage.focus();
      });

      // Start Menu Toggle
      const startButton = document.getElementById('startButton');
      const startMenu = document.getElementById('startMenu');

      startButton.addEventListener('click', () => {
        startMenu.classList.toggle('hidden');
      });

      // Close Start menu on click outside
      window.addEventListener('click', (e) => {
        if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
          startMenu.classList.add('hidden');
        }
      });