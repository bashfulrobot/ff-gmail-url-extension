# Gmail Universal URL Extension - Justfile
# Build and maintenance tasks

# Default recipe - show available commands
default:
    @just --list

# Build the extension package (.xpi file)
build:
    @echo "Building extension package..."
    @rm -f gmail-universal-url.xpi
    zip -r gmail-universal-url.xpi manifest.json background.js content.js logos/
    @echo "✓ Built gmail-universal-url.xpi"

# Run tests to verify URL extraction logic
test:
    @echo "Running tests..."
    node test.js

# Clean build artifacts
clean:
    @echo "Cleaning build artifacts..."
    @rm -f gmail-universal-url.xpi
    @echo "✓ Cleaned"

# Rebuild (clean + build)
rebuild: clean build

# Validate extension files exist
validate:
    @echo "Validating extension files..."
    @test -f manifest.json && echo "✓ manifest.json" || echo "✗ manifest.json missing"
    @test -f background.js && echo "✓ background.js" || echo "✗ background.js missing"
    @test -f content.js && echo "✓ content.js" || echo "✗ content.js missing"
    @test -f logos/gmailUrlLogo.png && echo "✓ logos/gmailUrlLogo.png" || echo "✗ logo missing"
    @test -f test.js && echo "✓ test.js" || echo "✗ test.js missing"

# Check if extension is valid JSON and has required fields
check-manifest:
    @echo "Checking manifest.json..."
    @node -e "const m = require('./manifest.json'); console.log('✓ Valid JSON'); \
      ['name', 'version', 'manifest_version'].forEach(f => { \
        if (!m[f]) throw new Error('Missing: ' + f); \
        console.log('✓', f + ':', m[f]); \
      });"

# Open Firefox debugging page for temporary installation
install:
    @echo "Opening Firefox extension debugging page..."
    @firefox about:debugging#/runtime/this-firefox &
    @echo "Click 'Load Temporary Add-on' and select manifest.json"

# Package and prepare for distribution
package: validate test build
    @echo ""
    @echo "Package ready for distribution:"
    @ls -lh gmail-universal-url.xpi
    @echo ""
    @echo "To install:"
    @echo "  1. Open Firefox"
    @echo "  2. Navigate to about:debugging"
    @echo "  3. Click 'Load Temporary Add-on'"
    @echo "  4. Select manifest.json from this directory"

# Development workflow - validate, test, and build
dev: validate check-manifest test build

# Show extension info
info:
    @echo "Gmail Universal URL Extension"
    @echo "=============================="
    @node -e "const m = require('./manifest.json'); \
      console.log('Name:', m.name); \
      console.log('Version:', m.version); \
      console.log('Description:', m.description); \
      console.log('ID:', m.browser_specific_settings.gecko.id);"

# Watch for changes and rebuild (requires inotify-tools)
watch:
    @echo "Watching for changes... (Ctrl+C to stop)"
    @while true; do \
      inotifywait -e modify,create,delete -r . --exclude '\.xpi$|\.git|node_modules' 2>/dev/null && \
      echo "Change detected, rebuilding..." && \
      just rebuild; \
    done
