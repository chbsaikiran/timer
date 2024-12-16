let timer;
let timeLeft;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startTimer') {
    timeLeft = message.totalSeconds;
    
    if (timer) {
      clearInterval(timer);
    }

    timer = setInterval(() => {
      timeLeft--;
      
      // Update popup with current time
      chrome.runtime.sendMessage({
        action: 'updateTimer',
        timeLeft: timeLeft
      });

      if (timeLeft <= 0) {
        clearInterval(timer);
        
        // Show Chrome notification
        chrome.notifications.create({
          type: 'basic',
          title: 'Timer Complete!',
          message: 'Your timer has finished!',
          iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=='
        });

        chrome.runtime.sendMessage({
          action: 'timerComplete'
        });
      }
    }, 1000);
  } else if (message.action === 'resetTimer') {
    if (timer) {
      clearInterval(timer);
    }
  }
}); 