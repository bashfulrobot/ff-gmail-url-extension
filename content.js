// Content script for Gmail Message URL Copier
// This is the core functionality from the bookmarklet

async function copyGmailMessageUrl() {
  try {
    // Get the message ID from the Gmail page
    const messageElement = document.querySelector('div[data-legacy-message-id]');
    if (!messageElement) {
      throw new Error('No Gmail message found on this page');
    }
    
    const messageId = messageElement.getAttribute('data-legacy-message-id');
    if (!messageId) {
      throw new Error('Could not extract message ID');
    }
    
    // Extract user number from URL (for multiple Gmail accounts)
    const userMatch = location.pathname.match(/\/u\/(\d)/);
    const user = userMatch ? userMatch[1] : '0';
    
    // Create the permanent all-mail URL
    const permanentUrl = `https://mail.google.com/mail/u/${user}/#all/${messageId}`;
    
    // Copy to clipboard
    await navigator.clipboard.writeText(permanentUrl);
    
    console.log('Gmail message URL copied to clipboard:', permanentUrl);
    return { success: true, url: permanentUrl };
    
  } catch (error) {
    console.error('Error copying Gmail URL:', error);
    return { success: false, error: error.message };
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyGmailUrl") {
    (async () => {
      try {
        const result = await copyGmailMessageUrl();
        sendResponse(result);
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    })();
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});

// Optional: Add keyboard shortcut support
document.addEventListener('keydown', (event) => {
  // Ctrl+Shift+C (or Cmd+Shift+C on Mac) to copy URL
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
    event.preventDefault();
    copyGmailMessageUrl();
  }
});
