# 🚀 Weather MCP Server 起動ガイド

## ✅ 動作確認済み！

MCPサーバーは**正常に起動できます**。以下の手順で設定してください。

## 📋 前提条件

- Node.js 18以上
- npm または yarn
- Claude Desktop アプリ

## 🔧 インストール手順

### 1. 依存関係のインストール

```bash
cd /Users/sho/mcp-app/weather-mcp-server
npm install
```

### 2. TypeScriptのビルド

```bash
npm run build
# または
npx tsc
```

### 3. 起動テスト

```bash
node dist/index.js
# "Weather MCP Server started" と表示されれば成功！
```

## 🎯 Claude Desktopへの設定

### 方法1: 設定ファイルを直接編集

1. Claude Desktopの設定ファイルを開く：
   - Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. 以下の内容を追加：

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": [
        "/Users/sho/mcp-app/weather-mcp-server/dist/index.js"
      ],
      "env": {
        "WEATHER_API_KEY": "demo_key"
      }
    }
  }
}
```

3. Claude Desktopを再起動

### 方法2: 用意した設定ファイルをコピー

```bash
# Macの場合
cp /Users/sho/mcp-app/claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Claude Desktopを再起動
```

## 🎮 使い方

Claude Desktopで以下のように話しかけるだけ：

```
You: 東京の天気を教えて
Claude: [Weather MCPを使用して天気情報を取得]

You: ニューヨークの天気は？
Claude: [Weather MCPを使用して天気情報を取得]
```

## 📊 無料枠と課金

- **無料**: 10回/日まで
- **Basic**: 100回/日（月1,500円）
- **Pro**: 無制限（月3,000円）

無料枠を超えると、アップグレードリンクが表示されます。

## 🔍 動作確認方法

1. Claude Desktopの設定画面で「MCP Servers」タブを確認
2. "weather" が表示されていればOK
3. チャットで「東京の天気は？」と聞いてみる

## ⚠️ トラブルシューティング

### MCPが認識されない場合

1. Claude Desktopを完全に終了（Cmd+Q / Alt+F4）
2. 設定ファイルのパスを絶対パスで記載しているか確認
3. `node dist/index.js` が単体で動作するか確認
4. Claude Desktopを再起動

### エラーが出る場合

```bash
# ログを確認
tail -f ~/Library/Logs/Claude/mcp.log  # Mac
```

### 権限エラーの場合

```bash
chmod +x /Users/sho/mcp-app/weather-mcp-server/dist/index.js
```

## 📝 開発モード

開発中は以下のコマンドで起動：

```bash
npm run dev
# TypeScriptを直接実行（tsx使用）
```

## 🎯 次のステップ

1. 実際のWeather APIキーを取得（OpenWeatherMap等）
2. `.env` ファイルを作成して設定
3. Stripeアカウントを作成して課金機能を有効化
4. 本番環境へデプロイ

## 💡 カスタマイズのヒント

`src/index.ts` を編集して機能追加：

- 新しいツールを追加
- 使用制限を変更
- レスポンスフォーマットを調整

変更後は必ず `npm run build` でビルドしてください。

---

**動作確認済み**: 2025年1月
**対応OS**: macOS, Windows, Linux
**必要なNode.js**: v18.0.0以上