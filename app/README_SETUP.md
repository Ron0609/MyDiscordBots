# Discord Spy Game Bot セットアップガイド 🔧

このガイドでは、Discord Spy Game Bot（小黒子）の詳細なセットアップ手順を説明します。

## 📋 事前準備

### 必要なもの
- Discord アカウント
- Node.js (v16以上推奨)
- テキストエディタ
- インターネット接続

### システム要件
- **OS**: Windows, macOS, Linux対応
- **メモリ**: 最小512MB RAM
- **ストレージ**: 100MB以上の空き容量

## 🔐 Discord Bot 作成

### 1. Discord Developer Portal でのセットアップ
1. [Discord Developer Portal](https://discord.com/developers/applications) にアクセス
2. 「New Application」をクリック
3. アプリケーション名を入力（例：「小黒子 Spy Bot」）
4. 利用規約に同意して「Create」をクリック

### 2. Bot の作成
1. 左サイドバーから「Bot」を選択
2. 「Add Bot」をクリック
3. 確認ダイアログで「Yes, do it!」をクリック
4. ボット名を設定（例：「小黒子」）
5. アイコンを設定（任意）

### 3. Bot Token の取得
1. 「Token」セクションで「Copy」をクリック
2. **重要**: このトークンは誰にも教えず、安全に保管してください

### 4. 必要な権限設定
「Bot」ページで以下を有効にします：
- ✅ `Send Messages` - メッセージ送信
- ✅ `Read Message History` - メッセージ履歴読み取り
- ✅ `View Channels` - チャンネル表示
- ✅ `Connect` - ボイスチャンネル接続
- ✅ `Use Slash Commands` - スラッシュコマンド使用

## 🤖 サーバーにボットを招待

### 1. OAuth2 URL 生成
1. 左サイドバーから「OAuth2」→「URL Generator」を選択
2. **SCOPES**で「bot」を選択
3. **BOT PERMISSIONS**で以下を選択：
   - Send Messages
   - Read Message History
   - View Channels
   - Connect
   - Use Voice Activity

### 2. ボットの招待
1. 生成されたURLをコピー
2. ブラウザでURLにアクセス
3. ボットを招待したいサーバーを選択
4. 「認証」をクリック

## 💻 環境別セットアップ

### 🌐 Replit での実行（推奨）
1. [Replit](https://replit.com) にログイン
2. 「Create Repl」→「Import from GitHub」を選択
3. このリポジトリのURLを入力
4. プロジェクトが作成されたら：
   - 左サイドバーの「Secrets」をクリック
   - キー：`DISCORD_BOT_TOKEN`
   - 値：先ほどコピーしたBotトークン
   - 「Add new secret」をクリック
5. 「Run」ボタンをクリックしてボット開始

### 💻 ローカル環境での実行
```bash
# リポジトリをクローン
git clone https://github.com/your-username/discord-spy-bot.git
cd discord-spy-bot

# 依存関係のインストール
npm install

# 環境変数ファイル作成
echo "DISCORD_BOT_TOKEN=your_actual_token_here" > .env

# ボットの起動
npm start
```

### ☁️ VPS/クラウドでの実行
```bash
# サーバーにファイルをアップロード
scp -r . user@your-server:/path/to/bot/

# サーバーにSSH接続
ssh user@your-server

# プロジェクトディレクトリに移動
cd /path/to/bot/

# Node.jsとnpmのインストール（Ubuntu例）
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 依存関係のインストール
npm install

# 環境変数設定
export DISCORD_BOT_TOKEN="your_actual_token_here"

# バックグラウンド実行
nohup npm start &
```

## 🎯 動作確認

### 1. ボット起動確認
コンソールに以下のメッセージが表示されることを確認：
```
キープアライブサーバーがポート8000で稼働中
Bot準備完了～ (Bot is ready!)
小黒子#9577でログインしました！
```

### 2. Discord での動作テスト
1. ボットが招待されたサーバーでボイスチャンネルに参加
2. テキストチャンネルで `@小黒子` とメンション
3. ヘルプメッセージが表示されることを確認
4. `.rule` コマンドでルールが表示されることを確認

### 3. ゲーム機能テスト
1. ボイスチャンネル（例：「General」）に複数人で参加
2. `.start General` コマンドを実行
3. ランダムに選ばれた人にDMが送信されることを確認
4. `.end` コマンドでスパイが公開されることを確認

## 🔄 24時間稼働設定

### Google Apps Script でキープアライブ（無料）
1. [Google Apps Script](https://script.google.com) にアクセス
2. 新しいプロジェクトを作成
3. 以下のコードを貼り付け：

```javascript
var replitUrl = "https://6082561f-6b48-44d8-abf7-8a4a2f0e7dec-00-2ld5i3oi3elz3.kirk.replit.dev/";
function keepBotAlive(){
 var json = {
   'type':'wake'
 };
 sendGlitch(replitUrl, json);
}

function sendGlitch(uri, json){
 var params = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : json,
   'muteHttpExceptions': true
 };
 response = UrlFetchApp.fetch(uri, params);
}
```

4. トリガーを設定
  - 実行する関数を選択：keepBotAlive
  - イベントのソースを選択：時間主導型
  - 時間ベースとトリガーのタイプを選択：分ベースのタイマー
  - 時間の間隔を選択（分）：5分おき
 

## 🛠️ カスタマイズ

### コマンドプレフィックス変更
```javascript
// server.js の19行目
const prefix = '!'; // '.'から'!'に変更
```

### ボット名前変更
```javascript
// ヘルプメッセージのボット名を変更
const helpMessage = `你好，私は[新しい名前]です。`;
```

### 新しいコマンド追加
```javascript
if (command === 'newcommand') {
    message.channel.send('新しいコマンドです！');
}
```

## 🔒 セキュリティベストプラクティス

### Do's ✅
- 環境変数でトークンを管理
- .gitignore でシークレットファイルを除外
- 定期的にトークンを再生成
- 最小限の権限のみ付与

### Don'ts ❌
- トークンをコードに直接記載
- パブリックリポジトリにトークンを含める
- 不要な権限を付与
- トークンを他人と共有

## 🐛 トラブルシューティング

### よくあるエラーと解決方法

#### ❌ `DISCORD_BOT_TOKEN environment variable is required!`
**原因**: Bot トークンが設定されていない
**解決**: 環境変数を正しく設定してください

#### ❌ `Error: Used disallowed intents`
**原因**: 必要なインテントが有効になっていない
**解決**: Discord Developer Portal でインテントを有効化

#### ❌ `DiscordAPIError: Missing Permissions`
**原因**: ボットに必要な権限がない
**解決**: サーバー設定でボットの権限を確認・追加

#### ❌ `チャンネル が見つかりません`
**原因**: ボイスチャンネル名が間違っている
**解決**: 正確なチャンネル名を入力

### ログの確認方法
```bash
# Replit の場合
Console タブでリアルタイムログを確認

# ローカルの場合
コマンドライン出力を確認

# VPS の場合
nohup.out ファイルまたは systemd ログを確認
```

## 📞 サポート

問題が解決しない場合：
1. GitHub Issues で問題を報告
2. Discord サーバーでの動作確認
3. 環境設定の再確認
4. 最新版への更新確認

## 🎉 完了

セットアップが完了しました！Discord サーバーでスパイゲームをお楽しみください。

ボットが正常に動作したら、ぜひ GitHub でスターを付けてください！