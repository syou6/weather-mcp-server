#!/bin/bash

# Weather MCP Server 自動インストールスクリプト

echo "🚀 Weather MCP Server インストーラー"
echo "=================================="

# 1. 依存関係のインストール
echo "📦 依存関係をインストール中..."
cd /Users/sho/mcp-app/weather-mcp-server
npm install

# 2. TypeScriptのビルド
echo "🔨 ビルド中..."
npm run build

# 3. 起動テスト
echo "🧪 起動テスト中..."
if node dist/index.js 2>&1 | grep -q "Weather MCP Server started"; then
    echo "✅ MCPサーバーの起動確認OK"
else
    echo "❌ MCPサーバーの起動に失敗"
    exit 1
fi

# 4. Claude Desktop設定ディレクトリの確認
CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
if [ ! -d "$CLAUDE_CONFIG_DIR" ]; then
    echo "📁 Claude設定ディレクトリを作成中..."
    mkdir -p "$CLAUDE_CONFIG_DIR"
fi

# 5. 既存の設定ファイルのバックアップ
CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"
if [ -f "$CONFIG_FILE" ]; then
    echo "💾 既存の設定をバックアップ中..."
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    
    # 既存の設定に追加
    echo "🔧 既存の設定にMCPサーバーを追加中..."
    
    # jqがインストールされているか確認
    if command -v jq &> /dev/null; then
        # jqを使って設定を追加
        jq '.mcpServers.weather = {
            "command": "node",
            "args": ["/Users/sho/mcp-app/weather-mcp-server/dist/index.js"],
            "env": {"WEATHER_API_KEY": "demo_key"}
        }' "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
    else
        echo "⚠️  jqがインストールされていません。手動で設定を追加してください。"
        echo "以下の内容を $CONFIG_FILE に追加してください："
        cat /Users/sho/mcp-app/claude_desktop_config.json
    fi
else
    # 新規作成
    echo "📝 新しい設定ファイルを作成中..."
    cp /Users/sho/mcp-app/claude_desktop_config.json "$CONFIG_FILE"
fi

echo ""
echo "✨ インストール完了！"
echo ""
echo "📌 次のステップ："
echo "1. Claude Desktopを完全に終了（Cmd+Q）"
echo "2. Claude Desktopを再起動"
echo "3. チャットで「東京の天気は？」と聞いてみる"
echo ""
echo "🎯 設定ファイルの場所："
echo "   $CONFIG_FILE"
echo ""
echo "💡 ヒント: うまくいかない場合は、Claude Desktopの設定画面で"
echo "   「Developer」→「MCP Servers」を確認してください"