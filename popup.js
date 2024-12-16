let timer;

document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('startTimer');
  const resetButton = document.getElementById('resetTimer');
  const minutesInput = document.getElementById('minutes');
  const secondsInput = document.getElementById('seconds');
  const timeLeft = document.getElementById('timeLeft');

  startButton.addEventListener('click', function() {
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    const totalSeconds = minutes * 60 + seconds;

    if (totalSeconds > 0) {
      chrome.runtime.sendMessage({
        action: 'startTimer',
        totalSeconds: totalSeconds
      });
      
      startButton.disabled = true;
    }
  });

  resetButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({ action: 'resetTimer' });
    minutesInput.value = '';
    secondsInput.value = '';
    timeLeft.textContent = '';
    startButton.disabled = false;
  });

  // Listen for timer updates
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'updateTimer') {
      const minutes = Math.floor(message.timeLeft / 60);
      const seconds = message.timeLeft % 60;
      timeLeft.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else if (message.action === 'timerComplete') {
      timeLeft.textContent = 'Time\'s up!';
      startButton.disabled = false;
    }
  });
}); 