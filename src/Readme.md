# Slack Reaction Autotool MVP 要件

## 日本語版

### 目的

* ユーザーごとにSlackのOAuth認証コードを入力し、自分のアカウントで自動リアクション（スタンプ）を押せるWebアプリを作成する。
* Slack Botや管理者権限は不要。
* MVPとして最小限のシンプルな構成とする。
* デザインはSlack UI/UXの雰囲気（余白、色、ボタン形状など）を参考に。

### 必須機能

* ユーザーがOAuthアクセストークンをフォームで入力
* チャンネルID、メッセージのTS（タイムスタンプ）、スタンプ名（emoji name）を入力欄で指定
* 「リアクションを追加」ボタンでAPI実行
* 実行結果（成功・失敗）を画面にシンプルに表示

### 画面構成

* ロゴ・アプリ名（Slack風）
* 入力フォーム（以下の項目）

  * OAuthアクセストークン
  * チャンネルID
  * メッセージTS
  * スタンプ名
* 実行ボタン
* 結果表示エリア
* （オプション）ヘルプまたは使い方（下部に小さく）

### 技術要件

* フロントエンドのみのSPA（React, Next.js, Vite等どれでも可）
* バックエンド不要（APIコールはフロントから直接）
* Slack API: `reactions.add` のみ利用
* データ保存不要（全て一時的な入力）

---

## English Version

### Purpose

* Build a web application where each user can input their own Slack OAuth access token and add emoji reactions to messages as themselves.
* No need for Slack bot or admin privileges.
* Keep the MVP simple and minimal.
* UI/UX should follow Slack design principles (spacing, colors, buttons, etc).

### Essential Features

* Input form for users to enter their OAuth access token
* Fields to specify Channel ID, Message Timestamp (TS), and Emoji name
* "Add Reaction" button triggers API call
* Simple result display (success or error)

### Page Layout

* Logo and app name (Slack style)
* Input form with the following fields:

  * OAuth Access Token
  * Channel ID
  * Message TS
  * Emoji name
* Action button
* Result display area
* (Optional) Help or instructions at the bottom

### Technical Requirements

* Frontend-only SPA (React, Next.js, or Vite, etc.)
* No backend (API requests sent directly from frontend)
* Uses only Slack API: `reactions.add`
* No persistent data (all input is temporary)
