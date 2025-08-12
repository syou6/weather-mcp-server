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

### 1. MCPサーバーをインストール
```bash
cd weather-mcp-server
npm install
npm run build
```

### 2. Claude Desktopに設定追加
```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/path/to/weather-mcp-server/dist/index.js"]
    }
  }
}
```

### 3. 使ってみる
Claude Desktopを再起動して「東京の天気を教えて」と話しかけるだけ！

## 📊 実際の収益例

```
Week 1: Product Huntで公開
Week 2: 100人が無料試用
Week 3: 30人が有料化（月1,500円）
Month 2: 口コミで100人に増加
→ 月収15万円達成 🎉
```

## 🎨 作るべきMCPアイデア

### 今週末に作れる簡単MCP
1. **PDF要約MCP** - PDFアップロードで即要約
2. **YouTube文字起こしMCP** - URLから文字起こし
3. **為替レートMCP** - リアルタイムレート取得
4. **翻訳MCP** - DeepL API連携
5. **株価チェックMCP** - リアルタイム株価

各MCPは100行程度で実装可能！

## 📈 成功の秘訣

1. **無料枠を設定** - まず使ってもらう
2. **自然な課金誘導** - 使用制限で自然にアップグレード
3. **即座の価値提供** - 設定後すぐに使える
4. **口コミ拡散** - Claudeユーザー間で自然に広がる

## 🔗 参考リンク

- [MCP公式ドキュメント](https://modelcontextprotocol.io)
- [Stripe決済統合ガイド](https://stripe.com/docs)
- [Claude Desktop設定方法](https://claude.ai/desktop)

---

**質問・サポート**: Issues欄でお気軽にどうぞ！

⭐ このプロジェクトが役立ったら、スターをお願いします！