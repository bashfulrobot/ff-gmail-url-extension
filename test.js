/**
 * Test file for Gmail URL extraction logic
 * Run with: node test.js
 */

// Copy the extraction function for testing
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

function createUniversalUrl(account, messageId) {
  return `https://mail.google.com/mail/u/${account}/#all/${messageId}`;
}

// Test cases from the requirements
const testUrls = [
  'https://mail.google.com/mail/u/1/#inbox/FMfcgzQcqRBZsNRVqvJrwlrBWgkDgJNs',
  'https://mail.google.com/mail/u/1/#label/Demos/FMfcgzQcqQqMPqLhfHmVRbcPBSwdMdfp',
  'https://mail.google.com/mail/u/1/#sent/KtbxLzfhXkNQNDZbMhZDFHQGCXJhvlTtVq',
  'https://mail.google.com/mail/u/1/#search/onboarding/FMfcgzQcqQqMPqLhfHmVRbcPBSwdMdfp',
  'https://mail.google.com/mail/u/0/#label/OSS/WhctKLbmqJgjcTNghLjzfrFXSdWwcbCmXDTgpZbWqxVJgvKGvlxgfQVjKNMWSmswsDNmvPv',
  'https://mail.google.com/mail/u/0/#sent/lLtBPchKkVppjsgxxghPLxphKwQXBMlNTHtXMCnNwpTGpqKsbSXKxsNJgZSbplpcnJrKxJGd',
  'https://mail.google.com/mail/u/0/#all/WhctKLbmqHZspphgSHTqBgMnmxQpNJDjZXkJTjFwXxcLzGbvqNkHlRKRNjlwLFjzvTXGSLq',
];

console.log('Testing Gmail URL extraction...\n');

testUrls.forEach((url, index) => {
  console.log(`Test ${index + 1}:`);
  console.log(`Input:  ${url}`);

  const info = extractGmailInfo(url);

  if (info) {
    const universalUrl = createUniversalUrl(info.account, info.messageId);
    console.log(`Account: ${info.account}`);
    console.log(`Message ID: ${info.messageId}`);
    console.log(`Output: ${universalUrl}`);
  } else {
    console.log('ERROR: Failed to extract info');
  }

  console.log('');
});

// Test edge cases
console.log('Testing edge cases...\n');

const edgeCases = [
  { url: 'https://mail.google.com/mail/#inbox/MessageId123456789', desc: 'Single account (no u/X)' },
  { url: 'https://example.com/mail/u/0/#inbox/MessageId123456789', desc: 'Wrong domain' },
  { url: 'https://mail.google.com/mail/u/2/', desc: 'No message ID' },
];

edgeCases.forEach((testCase, index) => {
  console.log(`Edge Case ${index + 1}: ${testCase.desc}`);
  console.log(`Input:  ${testCase.url}`);

  const info = extractGmailInfo(testCase.url);

  if (info) {
    const universalUrl = createUniversalUrl(info.account, info.messageId);
    console.log(`Output: ${universalUrl}`);
  } else {
    console.log('Result: No message found (expected for some cases)');
  }

  console.log('');
});
