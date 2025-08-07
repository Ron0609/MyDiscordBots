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

### 🌐 Koyeb での実行（推奨）
1. [Koyeb](https://app.koyeb.com/) にログイン（Github経由で登録することをおすすめ！）
2. 「Web service」→「GitHub」→「Install GitHub app」をクリック
3. 「MyDiscordBots」を選択
4. 「GPU Eco」>「Free」を選択
5. Settings項目を以下で設定
   -「Service type」: Web service
   -「Builder」: Dockerfile
   -「Environment variables and files」: Name:DISCORD_BOT_TOKEN, Value:'DiscordBotのトークン'
   -「Ports」: Port:3000, Protocol:HTTP, Path:/
   -「Health checks」: Port:3000, Protocol:HTTP, Grace Peropd:5, Interval:30, Restart limit:3, Timeout:5, Path:/, Method:Get   
6. 「Deploy」ボタンをクリックしてボット開始

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
  const koyebUrl = 'https://stupid-fenelia-ron69-1a909b36.koyeb.app/';
  
  try {
    const response = UrlFetchApp.fetch(koyebUrl, {
      method: 'GET',
      muteHttpExceptions: true
    });
    
    console.log(`キープアライブ送信: ${new Date()}`);
    console.log(`レスポンス: ${response.getResponseCode()}`);
    
    // POSTリクエストも送信（より確実）
    UrlFetchApp.fetch(koyebUrl, {
      method: 'POST',
      payload: 'type=wake',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      muteHttpExceptions: true
    });
    
  } catch (error) {
    console.error('エラー:', error);
  }
}
```
4. 「実行」ボタンをクリックし実行ログを確認する
```
22:28:32	お知らせ	実行開始
22:28:33	情報	キープアライブ送信: Thu Aug 07 2025 22:28:33 GMT+0900 (Japan Standard Time)
22:28:33	情報	レスポンス: 200
22:28:34	お知らせ	実行完了
```

5. トリガーを設定
  - 実行する関数を選択：keepBotAlive
  - イベントのソースを選択：時間主導型
  - 時間ベースとトリガーのタイプを選択：分ベースのタイマー
  - 時間の間隔を選択（分）：5分おき

## 🎉 完了
