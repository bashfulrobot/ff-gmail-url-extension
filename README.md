# Gmail Message URL Copier

A Firefox extension that copies permanent Gmail message URLs to your clipboard.

## Features

- Click the extension icon while viewing a Gmail message to copy its permanent URL
- Works with Gmail's universal message URLs (format: `https://mail.google.com/mail/u/0/#all/MESSAGE_ID`)
- Visual notification when URL is copied successfully

> **Note:** This extension has only been tested on Linux. While it should work on other platforms, your experience may vary.

## Installation

### Method 1: Install from GitHub Releases (Recommended)

1. Download the latest `.xpi` file from the [Releases page](https://github.com/bashfulrobot/ff-gmail-url-extension/releases)
2. Open Firefox and navigate to `about:addons`
3. Click the gear icon ⚙️
4. Select "Install Add-on From File..."
5. Select the downloaded `.xpi` file

**Note:** Firefox Developer Edition or Nightly may require disabling signature verification in `about:config` by setting `xpinstall.signatures.required` to `false`.

### Method 2: Temporary Installation (Development)

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on..."
4. Navigate to this directory and select `manifest.json`

**Note:** Temporary installations are removed when Firefox restarts.

### Method 3: Build and Install Locally (Sideloading)

#### Prerequisites (Firefox Developer Edition or Nightly only)
1. Navigate to `about:config` in Firefox
2. Search for `xpinstall.signatures.required`
3. Set it to `false`

#### Package and Install
1. Package the extension:
   ```bash
   ./package.sh
   ```

2. Install the XPI file:
   - Open Firefox and navigate to `about:addons`
   - Click the gear icon ⚙️
   - Select "Install Add-on From File..."
   - Select the generated `.xpi` file

## Usage

1. Open Gmail and navigate to any email message
2. Click the extension icon in the Firefox toolbar
3. The permanent URL for the message will be copied to your clipboard
4. You'll see a notification confirming the copy action

## Development

The extension consists of three main files:
- `manifest.json` - Extension configuration
- `background.js` - Background script handling toolbar icon clicks
- `content.js` - Content script that extracts message IDs from Gmail

## License

See LICENSE file for details.
