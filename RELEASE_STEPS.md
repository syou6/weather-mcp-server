# 📦 リリース手順（実践版）

## ステップ 1: npm公開
```bash
# 1. npmアカウント作成
# https://www.npmjs.com/signup

# 2. ログイン
npm login

# 3. パッケージ名の確認（既に使われていないか）
npm view @your-username/weather-mcp-server

# 4. ビルドとテスト
npm run build
npm test

# 5. 公開
npm publish --access public
```

## ステップ 2: GitHub公開
```bash
# 1. リポジトリ作成
gh repo create weather-mcp-server --public

# 2. コードをプッシュ
git add .
git commit -m "Initial release"
git push origin main

# 3. タグとリリース
git tag v1.0.0
git push --tags
gh release create v1.0.0 --generate-notes
```

## ステップ 3: 簡単インストール方法の提供

ユーザーは以下の3つの方法から選択可能:

### 🚀 超簡単（推奨）
```bash
npx @your-username/weather-mcp-server --install
```

### 📦 npm経由
```bash
npm install -g @your-username/weather-mcp-server
weather-mcp --setup
```

### 🔧 手動設定
```bash
# MCPサーバーを Claude に追加
claude mcp add weather "npx @your-username/weather-mcp-server"
```

## 実際のユーザー数を増やすコツ

1. **README.md に動画GIFを追加**
2. **5分でできるセットアップ動画**
3. **実用例を10個以上用意**
4. **エラー時の自動診断機能**
5. **日本語ドキュメント完備**