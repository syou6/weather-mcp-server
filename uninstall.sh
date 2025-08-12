#!/bin/bash

# Weather MCP Server アンインストールスクリプト

echo "🗑️  Weather MCP Server アンインストーラー"
echo "======================================"

CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Claude設定ファイルが見つかりません"
    exit 1
fi

echo "📝 設定ファイルからWeather MCPを削除中..."

# jqがインストールされているか確認
if command -v jq &> /dev/null; then
    # バックアップ作成
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup.before_uninstall"
    
    # weather MCPサーバーを削除
    jq 'del(.mcpServers.weather)' "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
    
    echo "✅ Weather MCPサーバーの設定を削除しました"
    echo "💾 バックアップ: $CONFIG_FILE.backup.before_uninstall"
else
    echo "⚠️  jqがインストールされていません"
    echo "手動で $CONFIG_FILE から weather セクションを削除してください"
fi

echo ""
echo "📌 次のステップ："
echo "1. Claude Desktopを再起動してください"
echo ""
echo "🔄 再インストールする場合："
echo "   ./install.sh"