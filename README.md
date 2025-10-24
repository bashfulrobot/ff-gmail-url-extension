# Gmail Universal URL Extension

A Firefox extension that extracts Gmail message IDs and creates universal URLs that work regardless of the message's label, folder, or location.

## Problem

Gmail URLs change based on where a message is located:
- `https://mail.google.com/mail/u/1/#inbox/FMfcgzQcqRBZsNRVqvJrwlrBWgkDgJNs`
- `https://mail.google.com/mail/u/1/#label/Demos/FMfcgzQcqQqMPqLhfHmVRbcPBSwdMdfp`
- `https://mail.google.com/mail/u/1/#sent/KtbxLzfhXkNQNDZbMhZDFHQGCXJhvlTtVq`

This makes sharing links fragile - if the message moves, the link breaks.

## Solution

This extension extracts the unique message ID and account context, then creates a universal URL using the `#all` view:

`https://mail.google.com/mail/u/0/#all/WhctKLbmqHZspphgSHTqBgMnmxQpNJDjZXkJTjFwXxcLzGbvqNkHlRKRNjlwLFjzvTXGSLq`

This URL works regardless of where the message is located.

## Features

- Extracts message IDs from any Gmail view (inbox, labels, sent, search results, etc.)
- Preserves account context for multi-account users
- Works on all platforms (Wayland, X11, Windows, Mac)
- Keyboard shortcut support
- Visual feedback when URL is copied
- Only activates on mail.google.com

## Installation

### Manual Installation (Temporary)

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Navigate to the extension directory and select `manifest.json`

The extension will be active until Firefox is restarted.

### Permanent Installation (Unsigned)

1. Open Firefox and navigate to `about:config`
2. Search for `xpinstall.signatures.required`
3. Set it to `false` (only available in Developer Edition or Nightly)
4. Package the extension:
   ```bash
   cd /home/dustin/dev/github/ff-gmail-url-extension
   zip -r gmail-universal-url.xpi manifest.json background.js content.js logos/
   ```
5. Drag and drop the `.xpi` file into Firefox

### Installation with Ansible

Example Ansible playbook to install the extension:

```yaml
---
- name: Install Gmail Universal URL Extension
  hosts: localhost
  tasks:
    - name: Create Firefox extensions directory
      file:
        path: "{{ ansible_env.HOME }}/.mozilla/firefox/{{ firefox_profile }}/extensions/gmail-universal-url@example.com"
        state: directory
        mode: '0755'

    - name: Copy extension files
      copy:
        src: "{{ item }}"
        dest: "{{ ansible_env.HOME }}/.mozilla/firefox/{{ firefox_profile }}/extensions/gmail-universal-url@example.com/"
      loop:
        - manifest.json
        - background.js
        - content.js

    - name: Copy logos directory
      copy:
        src: logos/
        dest: "{{ ansible_env.HOME }}/.mozilla/firefox/{{ firefox_profile }}/extensions/gmail-universal-url@example.com/logos/"

    - name: Restart Firefox
      shell: killall firefox && sleep 2 && firefox &
      async: 10
      poll: 0
```

## Usage

### Keyboard Shortcut

While viewing a Gmail message, press:
- **Linux/Windows**: `Ctrl+Shift+U`
- **Mac**: `Command+Shift+U`

The universal URL will be copied to your clipboard, and a notification will appear confirming the action.

### Customizing the Keyboard Shortcut

1. Navigate to `about:addons` in Firefox
2. Click the gear icon and select "Manage Extension Shortcuts"
3. Find "Gmail Universal URL"
4. Click the current shortcut and press your desired key combination

## How It Works

The extension:

1. Monitors the current URL when you trigger the keyboard shortcut
2. Extracts the account number (e.g., `u/1` → account `1`)
3. Extracts the message ID from the hash fragment (the last segment)
4. Constructs a universal URL: `https://mail.google.com/mail/u/{account}/#all/{messageId}`
5. Copies the URL to your clipboard using the Clipboard API (works on all platforms)
6. Shows a visual notification

## Development

### Build System (just)

This project uses [just](https://github.com/casey/just) for build and maintenance tasks.

Available commands:

```bash
just              # List all available commands
just dev          # Full development workflow (validate, check, test, build)
just build        # Build the .xpi package
just test         # Run test suite
just validate     # Validate all required files exist
just check-manifest  # Verify manifest.json is valid
just info         # Show extension metadata
just package      # Full release build (validate + test + build)
just clean        # Remove build artifacts
just rebuild      # Clean and build
just install      # Open Firefox debugging page
just watch        # Watch for changes and auto-rebuild (requires inotify-tools)
```

Quick start:

```bash
# Install just if needed
cargo install just

# Run full development workflow
just dev

# Build the extension
just build
```

### Testing

Run the test suite to verify URL extraction logic:

```bash
just test
# or directly:
node test.js
```

This tests various URL formats and edge cases.

### File Structure

```
.
├── manifest.json       # Extension configuration
├── background.js       # Background script (handles keyboard shortcuts)
├── content.js          # Content script (URL extraction and clipboard)
├── test.js             # Test suite
├── justfile            # Build and maintenance tasks
├── logos/              # Extension icons
│   └── gmailUrlLogo.png
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Supported URL Formats

The extension handles all Gmail URL formats:

- Inbox: `#inbox/{messageId}`
- Sent: `#sent/{messageId}`
- Labels: `#label/{labelName}/{messageId}`
- Search: `#search/{query}/{messageId}`
- All Mail: `#all/{messageId}` (already universal)
- Multi-account: `/u/0/`, `/u/1/`, etc.
- Single account: No `/u/X/` segment

## Troubleshooting

### Extension not working

1. Verify you're on `mail.google.com`
2. Ensure you're viewing a message (URL should contain a message ID)
3. Check Firefox console for errors (F12 → Console)

### Clipboard not working

The extension uses the modern Clipboard API which requires HTTPS. Gmail uses HTTPS, so this should work on all platforms (Wayland, X11, Windows, Mac).

If clipboard access is blocked:
1. Check Firefox permissions for the extension in `about:addons`
2. Ensure "Access your data for mail.google.com" is enabled

### No notification appearing

The extension injects a notification into the DOM. If you don't see it:
1. Check if you have Gmail Labs features that might conflict
2. Try disabling other Gmail extensions temporarily
3. Check the browser console for JavaScript errors

## License

MIT

## Contributing

Contributions welcome! Please ensure all tests pass before submitting PRs.
