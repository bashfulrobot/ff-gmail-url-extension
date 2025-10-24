#!/bin/bash
# Package Firefox extension for sideloading

set -e

EXTENSION_NAME="gmail-url-extension"
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')
OUTPUT_FILE="${EXTENSION_NAME}-v${VERSION}.xpi"

echo "Packaging ${EXTENSION_NAME} v${VERSION}..."

# Remove old package if it exists
if [ -f "$OUTPUT_FILE" ]; then
    echo "Removing existing package: $OUTPUT_FILE"
    rm "$OUTPUT_FILE"
fi

# Create the XPI package
echo "Creating XPI package..."
# Use Firefox recommended zip options (-r recursive, -FS for filesystem sync)
zip -r -FS "$OUTPUT_FILE" \
    manifest.json \
    background.js \
    content.js \
    icons/ \
    -x "*.git*" "*.DS_Store" "package.sh" "INSTALL.md" "README.md" "*.xpi"

echo "✓ Package created: $OUTPUT_FILE"
echo ""
echo "To install:"
echo "  1. Open Firefox and go to about:addons"
echo "  2. Click the gear icon ⚙️ and select 'Install Add-on From File...'"
echo "  3. Select $OUTPUT_FILE"
echo ""
echo "Note: You may need to enable unsigned extensions in about:config"
echo "      (xpinstall.signatures.required = false)"
