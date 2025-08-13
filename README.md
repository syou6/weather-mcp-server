# 🌤️ Weather MCP Server

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://github.com/anthropics/mcp)

**Claude で天気情報を取得できる MCP (Model Context Protocol) サーバー**

[English](README_EN.md) | 日本語

</div>

## ✨ 特徴

- 🌍 **世界中の天気情報**: 都市名を指定するだけで天気を取得
- 🤖 **Claude統合**: Claude Code/Desktop で直接使用可能
- 🔧 **簡単セットアップ**: ワンコマンドでインストール
- 📊 **詳細情報**: 気温、湿度、風速、天気状況を提供
- 💰 **課金システム内蔵**: Stripe統合で収益化可能

## 📁 プロジェクト構成

```
mcp-app/
├── weather-mcp-server/    # MCPサーバー実装（100行）
│   ├── package.json
│   └── src/
│       └── index.ts      # たった1ファイルで完結！
│
├── weather-webapp/        # Webアプリ実装（500行以上）
│   ├── package.json
│   ├── app/
│   │   ├── page.tsx      # UIコンポーネント
│   │   └── api/
│   │       └── weather/
│   │           └── route.ts
│   └── ...多数のファイル
│
├── payment-system/        # 課金システム
│   ├── server.ts         # Stripe統合
│   ├── pricing-page.html # 料金ページ
│   └── schema.prisma     # データベース定義
│
└── COMPARISON.md         # 詳細比較表
```

## 🎯 なぜMCPサーバーを選ぶべきか

### 1. 開発速度が10倍速い
- **MCP**: 1ファイル、100行で完成
- **Webアプリ**: 20ファイル以上、500行以上

### 2. 運用コストゼロ
- **MCP**: ユーザーのPC上で動作（サーバー不要）
- **Webアプリ**: 月額サーバー代 + ドメイン代

### 3. 自然な使用体験
```
# MCPサーバー
User: "東京の天気は？"
Claude: 気温18°C、晴れです。

# Webアプリ
1. ブラウザ開く
2. URL入力
3. ログイン
4. 検索
5. 結果確認
```

## 💰 収益化が簡単

### 実装済みの課金機能
- ✅ 使用回数制限
- ✅ Stripe決済統合
- ✅ 自動アップグレード促進
- ✅ APIキー自動発行

### 料金プラン例
- **Free**: 10回/日（無料）
- **Basic**: 100回/日（月1,500円）
- **Pro**: 無制限（月3,000円）

## 🚀 今すぐ始める

### 方法1: ソースからビルド
```bash
# クローン
git clone https://github.com/syou6/weather-mcp-server.git
cd weather-mcp-server/weather-mcp-server
npm install
npm run build
```

### 方法2: Claude Codeで設定
```bash
# Claude Codeに追加
claude mcp add weather "node $(pwd)/dist/index.js"
```

### 設定ファイル例（claude_desktop_config.json）
```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/Users/your-name/weather-mcp-server/weather-mcp-server/dist/index.js"]
    }
  }
}
```

### 3. 使ってみる
Claude Codeを再起動して「東京の天気を教えて」と話しかけるだけ！

## 📊 実際の収益例

```
Week 1: Product Huntで公開
Week 2: 100人が無料試用
Week 3: 30人が有料化（月1,500円）
Month 2: 口コミで100人に増加
→ 月収15万円達成 🎉
```

## 📝 使い方

Claude で以下のように質問するだけ:

```
「東京の天気を教えて」
「What's the weather in New York?」
「パリの今日の気温は？」
```

## ⚙️ API キーの設定（オプション）

より詳細な天気情報を取得するには、OpenWeatherMap API キーを設定:

1. [OpenWeatherMap](https://openweathermap.org/api) でAPIキーを取得
2. 環境変数を設定: `export WEATHER_API_KEY=your_api_key_here`

## 🔗 参考リンク

- [MCP公式ドキュメント](https://modelcontextprotocol.io)
- [Stripe決済統合ガイド](https://stripe.com/docs)
- [このプロジェクトのGitHub](https://github.com/syou6/weather-mcp-server)

---

**開発者**: [@syou6](https://github.com/syou6)
**質問・サポート**: [Issues](https://github.com/syou6/weather-mcp-server/issues)でお気軽にどうぞ！

⭐ このプロジェクトが役立ったら、スターをお願いします！