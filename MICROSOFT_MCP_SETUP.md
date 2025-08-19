# Microsoft Playwright MCP Setup for CanonCore

This document explains how to use Microsoft's official Playwright MCP (Model Context Protocol) server for browser automation and testing in the CanonCore project.

## What is Microsoft Playwright MCP?

Microsoft's Playwright MCP server enables LLMs to interact with web pages using Playwright's accessibility tree instead of screenshots. This provides fast, lightweight, and deterministic browser automation without requiring vision models.

## Installation Complete ✅

The following has been set up for you:

- `@playwright/mcp@latest` - Microsoft's official Playwright MCP server
- `mcp-config.json` - Local MCP configuration file
- `claude-desktop-mcp-config.json` - Claude Desktop configuration example
- Package.json scripts for MCP operations

## Package.json Scripts Added

```bash
npm run mcp:start           # Start Microsoft Playwright MCP server
npm run mcp:test            # Test MCP server with CanonCore (requires dev server)
```

## Claude Desktop MCP Configuration

To use Microsoft's Playwright MCP with Claude Desktop, add this configuration:

**Location:** `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

**Note:** The exact configuration is available in `claude-desktop-mcp-config.json` in the project root.

## MCP Capabilities

Microsoft's Playwright MCP server provides:

- **Browser Automation**: Navigate pages, click elements, fill forms using accessibility tree
- **Multi-browser Support**: Chrome, Firefox, WebKit, Microsoft Edge
- **Device Emulation**: iPhone, Android, desktop devices
- **Accessibility-focused**: Uses Playwright's accessibility tree for reliable automation
- **Session Management**: Save browser state, storage, and traces
- **Extension Support**: Connect to running browser instances via extension
- **Vision & PDF**: Optional capabilities for enhanced content processing
- **Proxy Support**: Configure network proxies and bypass rules

## Key Features

- **Fast & Lightweight**: Uses structured accessibility data, not screenshots
- **Deterministic**: No ambiguity from visual interpretation
- **LLM-Optimized**: Designed specifically for AI agent interaction
- **Cross-platform**: Works on Windows, macOS, and Linux

## Usage Examples

### Basic Browser Automation
Ask Claude to:
- "Navigate to the CanonCore homepage and extract all universe names"
- "Fill out the universe creation form with test data"
- "Take a screenshot of the discover page"

### Testing & Validation
Ask Claude to:
- "Test the sign-in flow and verify authentication works"
- "Check that all navigation links work correctly"
- "Validate form validation on the content creation page"

### Data Extraction
Ask Claude to:
- "Extract all public universes and their details"
- "Get user progress data from the dashboard"
- "Scrape content hierarchy from a universe page"

## Running with CanonCore

Before using MCP with CanonCore, ensure your development server is running:

```bash
npm run dev
```

Then you can:

```bash
# Start the MCP server interactively
npm run mcp:start

# Test MCP server with CanonCore
npm run mcp:test
```

## MCP Server Options

The Microsoft Playwright MCP server supports many options:

```bash
npx @playwright/mcp@latest [options]

Key Options:
--browser <browser>         # chrome, firefox, webkit, msedge
--headless                  # Run in headless mode
--device <device>           # Emulate specific device
--viewport-size <size>      # Set viewport dimensions
--save-session              # Save browser session
--save-trace                # Save Playwright trace
--user-data-dir <path>      # Custom user data directory
--extension                 # Connect via browser extension
```

## Project Structure

```
├── mcp-config.json                    # Local MCP configuration
├── claude-desktop-mcp-config.json     # Claude Desktop config example
├── test-microsoft-mcp.js              # MCP functionality test script
└── MICROSOFT_MCP_SETUP.md             # This documentation
```

## Next Steps

1. **Configure Claude Desktop** - Copy the MCP configuration to your Claude Desktop settings
2. **Restart Claude Desktop** - For the MCP server to be recognized
3. **Start Dev Server** - Run `npm run dev` to test with CanonCore
4. **Test Integration** - Ask Claude to navigate and interact with your application

## Troubleshooting

- **MCP not working:** Ensure Claude Desktop is restarted after configuration changes
- **Browser issues:** The server will automatically download required browser binaries
- **Dev server required:** CanonCore testing requires `npm run dev` to be running
- **Timeout issues:** Increase timeout in MCP server options if needed

## Security Note

This setup works with your local development environment. The MCP server runs locally and provides secure browser automation capabilities.

## Microsoft vs Other MCP Servers

Microsoft's implementation focuses on:
- **Accessibility-first**: Uses Playwright's accessibility tree
- **Performance**: Lightweight, no screenshot processing
- **Reliability**: Deterministic automation without visual ambiguity
- **Official Support**: Backed by Microsoft's Playwright team