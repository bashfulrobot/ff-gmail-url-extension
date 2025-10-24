/**
 * Gmail Universal URL Extension
 * Extracts message IDs and creates universal URLs
 */

/**
 * Extracts the account number and message ID from a Gmail URL
 * @param {string} url - The current Gmail URL
 * @returns {{account: string, messageId: string} | null} - Account and message ID, or null if not found
 */
function extractGmailInfo(url) {
  try {
    const urlObj = new URL(url);

    // Ensure we're on Gmail
    if (!urlObj.hostname.includes('mail.google.com')) {
      return null;
    }

    // Extract account number (default to 0 if not present)
    const accountMatch = urlObj.pathname.match(/\/mail\/u\/(\d+)/);
    const account = accountMatch ? accountMatch[1] : '0';

    // Extract message ID from hash
    // Hash format: #inbox/messageId or #label/LabelName/messageId or #search/query/messageId
    const hash = urlObj.hash;
    if (!hash || hash.length < 2) {
      return null;
    }

    // Remove the # and split by /
    const hashParts = hash.substring(1).split('/');

    // Message ID is always the last part
    const messageId = hashParts[hashParts.length - 1];

    // Validate message ID (should be a long alphanumeric string)
    if (!messageId || messageId.length < 10) {
      return null;
    }

    return { account, messageId };
  } catch (error) {
    console.error('Error parsing Gmail URL:', error);
    return null;
  }
}

/**
 * Creates a universal Gmail URL from account and message ID
 * @param {string} account - Account number
 * @param {string} messageId - Message ID
 * @returns {string} - Universal Gmail URL
 */
function createUniversalUrl(account, messageId) {
  return `https://mail.google.com/mail/u/${account}/#all/${messageId}`;
}

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - True if successful
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Shows a temporary notification to the user
 * @param {string} message - Message to display
 * @param {boolean} isError - Whether this is an error message
 */
function showNotification(message, isError = false) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background-color: ${isError ? '#d32f2f' : '#2e7d32'};
    color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    transition: opacity 0.3s ease;
  `;

  document.body.appendChild(notification);

  // Fade out and remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

/**
 * Main function to extract and copy universal Gmail URL
 */
async function extractAndCopyUrl() {
  const currentUrl = window.location.href;
  const gmailInfo = extractGmailInfo(currentUrl);

  if (!gmailInfo) {
    showNotification('No Gmail message found in current URL', true);
    return;
  }

  const universalUrl = createUniversalUrl(gmailInfo.account, gmailInfo.messageId);
  const success = await copyToClipboard(universalUrl);

  if (success) {
    showNotification('Universal URL copied to clipboard!');
    console.log('Copied URL:', universalUrl);
  } else {
    showNotification('Failed to copy URL to clipboard', true);
  }
}

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'extractUrl') {
    extractAndCopyUrl();
  }
});
