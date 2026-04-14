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

### 🌐 Render での実行（推奨）
1.  [Render](https://render.com/) にログイン（GitHub経由で登録することをおすすめ！）
2. 「New」→「Web Service」→「Connect GitHub」をクリック
3. 「MyDiscordBots」を選択
4. 「Instance Type」>「Free」を選択
5.  Settings項目を以下で設定
- 「Service type」: Web Service
- 「Runtime」: Docker（Dockerfileを使用している場合）
- 「Environment variables」:
  - 　Name: DISCORD_BOT_TOKEN
  - 　Value: DiscordBotのトークン
- 「Region」: 任意（例: Oregon）
- 「Branch」: main
- 「Auto-Deploy」: Yes（推奨）

## 🎯 動作確認

### 1. ボット起動確認
「Deployment」の「Logs」に以下のメッセージが表示されることを確認：
```
Instance created. Preparing to start...
Bot準備完了～
Instance is healthy. All health checks are passing.
post:wake
Woke up in post
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
function keepBotAlive() {
  const url = 'https://mydiscordbots.onrender.com/';

  try {
    // 1回目：サーバーを起こす
    UrlFetchApp.fetch(url, {
      method: 'GET',
      muteHttpExceptions: true
    });

    console.log("1回目アクセス（起動要求）: " + new Date());

    // 10秒待つ（重要）
    Utilities.sleep(10000);

    // 2回目：起動確認
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      muteHttpExceptions: true
    });

    console.log("2回目アクセス（確認）: " + new Date());
    console.log("ステータス: " + response.getResponseCode());

  } catch (error) {
    console.log("起動中（timeoutでも正常）: " + new Date());
  }
}
```
4. 「実行」ボタンをクリックし実行ログを確認する
```
0:02:03	お知らせ	実行開始
0:08:03	情報	起動中（timeoutでも正常）: Wed Apr 15 2026 00:08:03 GMT+0900 (Japan Standard Time)
0:08:03	お知らせ	実行完了
```

5. トリガーを設定
  - 実行する関数を選択：keepBotAlive
  - イベントのソースを選択：時間主導型
  - 時間ベースとトリガーのタイプを選択：分ベースのタイマー
  - 時間の間隔を選択（分）：5分おき

## 🎉 完了
