# 📋 GitHub公開手順

## 1. GitHub.comでリポジトリを作成

1. [GitHub.com](https://github.com) にログイン
2. 右上の「+」ボタン → 「New repository」をクリック
3. 以下の情報を入力:
   - **Repository name**: `weather-mcp-server`
   - **Description**: `🌤️ Weather MCP Server - Get weather info through Claude`
   - **Public** を選択
   - **Initialize repository with**: 何もチェックしない（既にファイルがあるため）
4. 「Create repository」をクリック

## 2. ローカルからプッシュ

GitHubでリポジトリを作成した後、以下のコマンドを実行:

```bash
# リモートリポジトリを追加（YOUR_USERNAMEを自分のGitHubユーザー名に置き換え）
git remote add origin https://github.com/YOUR_USERNAME/weather-mcp-server.git

# または SSH を使う場合
git remote add origin git@github.com:YOUR_USERNAME/weather-mcp-server.git

# mainブランチにプッシュ
git branch -M main
git push -u origin main
```

## 3. 公開後の設定

### Topics を追加
リポジトリページで歯車アイコン → Topics に以下を追加:
- `mcp`
- `claude`
- `weather`
- `api`
- `typescript`

### About セクションを設定
- Website: MCP公式ドキュメントのリンク
- Topics: 上記のタグ

### GitHub Pages を有効化（オプション）
Settings → Pages → Source → Deploy from a branch → main → / (root)

## 4. リリースを作成

```bash
# タグを作成
git tag v1.0.0
git push origin v1.0.0
```

または GitHub の Releases ページから:
1. 「Create a new release」をクリック
2. Tag version: `v1.0.0`
3. Release title: `Weather MCP Server v1.0.0`
4. Describe this release:
   ```
   ## 🎉 初回リリース
   
   ### ✨ 機能
   - 世界中の天気情報取得
   - Claude統合
   - 簡単セットアップ
   - 課金システム（Stripe統合）
   
   ### 📝 使い方
   README.md を参照してください。
   ```

## 5. 宣伝する

### SNSで共有
```
🌤️ Weather MCP Server をリリースしました！

Claude で天気情報を取得できる MCP サーバーです。
「東京の天気は？」と聞くだけで使えます。

⭐ GitHub: https://github.com/YOUR_USERNAME/weather-mcp-server

#MCP #Claude #OpenSource
```

### コミュニティに投稿
- Reddit: r/ClaudeAI
- Discord: Anthropic Community
- X (Twitter): #MCP タグ付き

完了！🎉