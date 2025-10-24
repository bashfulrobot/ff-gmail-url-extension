// Background script for Gmail Message URL Copier
chrome.action.onClicked.addListener((tab) => {
  // Check if we're on Gmail
  if (tab.url.includes('mail.google.com')) {
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {action: "copyGmailUrl"}, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error:', chrome.runtime.lastError);
        // Show notification of error
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'Gmail URL Copier',
          message: 'Error: Make sure you have a Gmail message open'
        });
      } else if (response && response.success) {
        // Show success notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'Gmail URL Copier',
          message: 'Gmail message URL copied to clipboard!'
        });
      }
    });
  } else {
    // Show notification that we're not on Gmail
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Gmail URL Copier',
      message: 'Please navigate to Gmail first'
    });
  }
});
