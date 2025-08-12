#!/bin/bash

# Weather MCP Server - One-liner Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/your-username/weather-mcp/main/install.sh | bash

set -e

echo "🌤️  Installing Weather MCP Server..."

# Detect OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     PLATFORM=linux;;
    Darwin*)    PLATFORM=macos;;
    *)          echo "Unsupported OS: ${OS}" && exit 1;;
esac

# Install via npm
echo "📦 Installing package..."
npm install -g @your-username/weather-mcp-server

# Get Claude config path
if [ "$PLATFORM" = "macos" ]; then
    CONFIG_DIR="$HOME/Library/Application Support/Claude"
else
    CONFIG_DIR="$HOME/.config/claude"
fi

# Create config directory if not exists
mkdir -p "$CONFIG_DIR"

# Add to Claude config
echo "⚙️  Configuring Claude..."
cat > "$CONFIG_DIR/claude_desktop_config.json" <<EOF
{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["@your-username/weather-mcp-server"],
      "env": {
        "WEATHER_API_KEY": "${WEATHER_API_KEY:-demo_key}"
      }
    }
  }
}
EOF

echo "✅ Weather MCP Server installed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Get your Weather API key from: https://openweathermap.org/api"
echo "2. Set your API key: export WEATHER_API_KEY=your_key_here"
echo "3. Restart Claude Desktop"
echo "4. Try asking: 'What's the weather in Tokyo?'"