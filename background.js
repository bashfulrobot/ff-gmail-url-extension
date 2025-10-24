/**
 * Background script for Gmail Universal URL Extension
 * Handles keyboard shortcuts and forwards commands to content script
 */

// Listen for keyboard shortcut
browser.commands.onCommand.addListener((command) => {
  if (command === 'copy-universal-url') {
    // Query the active tab
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]) {
        // Send message to content script
        browser.tabs.sendMessage(tabs[0].id, { action: 'extractUrl' }).catch((error) => {
          console.error('Error sending message to content script:', error);
        });
      }
    });
  }
});
