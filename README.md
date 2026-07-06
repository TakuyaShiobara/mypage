# mypage — Takaya Shiobara Portfolio

Firebase(Firestore / Storage / Authentication / Hosting)を使ったCMS型ポートフォリオサイトです。ビルドツールやフレームワークは使わず、HTML / CSS / JavaScript(ES Modules)のみで構成しています。`/admin` から作品・プロフィール・スキル・SNSリンクを編集できます。

## 目次

- [ディレクトリ構成](#ディレクトリ構成)
- [ローカル実行方法](#ローカル実行方法)
- [Firebase初期設定](#firebase初期設定)
- [Firestore構成](#firestore構成)
- [Storage構成](#storage構成)
- [メール送信機能(お問い合わせフォーム)の設定方法](#メール送信機能お問い合わせフォームの設定方法)
- [デプロイ手順](#デプロイ手順)
- [管理画面の使い方](#管理画面の使い方)
- [既知の制約](#既知の制約)

## ディレクトリ構成

```
/
├── index.html / about.html / works.html / work.html / skills.html / contact.html / 404.html
├── admin/                    管理画面(Googleログイン必須)
│   ├── index.html            ログイン画面
│   ├── dashboard.html        ダッシュボード(総作品数・カテゴリ別件数)
│   ├── works.html            作品一覧・削除・公開切替・並び替え
│   ├── work-edit.html        作品の新規作成・編集
│   ├── profile.html          プロフィール編集
│   ├── skills.html           スキル編集
│   └── socials.html          SNSリンク編集
├── css/
│   ├── tokens.css            カラー・フォント・余白などのデザイントークン
│   ├── base.css              リセット・基本スタイル
│   ├── components.css        ボタン・タグ・カード・フォームなど共通部品
│   ├── layout.css            ヘッダー・フッター・ヒーロー・グリッド
│   ├── pages.css             各ページ固有のスタイル
│   └── admin.css             管理画面のスタイル
├── js/
│   ├── config.example.js     Firebase/EmailJS設定のテンプレート(コピーして使用)
│   ├── config.js             実際の設定(gitignore対象・各自作成)
│   ├── firebase-init.js      Firebase初期化(Firestore/Auth/Storage)
│   ├── data/                 Firestoreアクセス層(profile/works/skills/socials)
│   ├── components/           ヘッダー・フッター・作品カードなど共通UI部品
│   ├── pages/                公開ページごとのロジック
│   ├── admin/                管理画面のロジック(認証ガード含む)
│   └── utils/                DOMヘルパー・バリデーション・アイコン
├── assets/                   プレースホルダー画像・favicon・アイコン
├── scripts/                  Firestore初期データ投入用スクリプト(サイト本体には含まれない)
├── firebase.json / .firebaserc / firestore.rules / firestore.indexes.json / storage.rules
├── robots.txt / sitemap.xml
```

## ローカル実行方法

1. Firebase設定ファイルを作成します。

   ```bash
   cp js/config.example.js js/config.js
   ```

   `js/config.js` を開き、Firebaseプロジェクトの設定値と EmailJS の値を入力してください(詳細は後述)。このファイルは `.gitignore` 対象なのでコミットされません。

2. ローカルサーバーで配信します(`fetch`/ES Modulesを使うため `file://` では動作しません)。

   ```bash
   npx serve .
   # もしくは
   python3 -m http.server 8000
   ```

3. ブラウザで `http://localhost:8000` (使用したツールに応じたポート)を開きます。

Firestoreのセキュリティルールやデータ構造も含めてローカルで検証したい場合は、Firebase CLIのエミュレータが便利です。

```bash
npm install -g firebase-tools
firebase login
firebase emulators:start
```

エミュレータを使う場合は `js/firebase-init.js` で `connectFirestoreEmulator` / `connectAuthEmulator` / `connectStorageEmulator` を呼び出す設定を追加してください(本番運用に不要なため、デフォルトでは組み込んでいません)。

## Firebase初期設定

1. [Firebase Console](https://console.firebase.google.com/) で新規プロジェクトを作成します。
2. **Authentication** > Sign-in method で **Google** プロバイダを有効化します。
3. **Firestore Database** を作成します(本番モードで作成してOK。ルールは本リポジトリの `firestore.rules` で上書きします)。
4. **Storage** を有効化します。
5. **プロジェクトの設定 > 全般 > マイアプリ** でWebアプリを追加し、表示された `firebaseConfig` を `js/config.js` の `firebaseConfig` にコピーします。
6. `js/config.js` の `adminEmail` を、管理画面にログインを許可するあなたのGoogleアカウントのメールアドレスに設定します。
7. `firestore.rules` と `storage.rules`内の `tak.sobr@gmail.com` を、手順6と同じメールアドレスに書き換えます(セキュリティルールはサーバー側の設定のため、`config.js` とは別に更新が必要です)。
8. `.firebaserc` の `YOUR_FIREBASE_PROJECT_ID` を実際のプロジェクトIDに書き換えます。
9. ルールとインデックスをデプロイします。

   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

### 初期データの投入(任意)

サイトを空の状態から始めても管理画面で全て入力できますが、サンプルデータを流し込みたい場合は `scripts/` 以下のNode.jsスクリプトが使えます(サイト本体のデプロイには含まれません)。

```bash
cd scripts
npm install
# Firebase Console > プロジェクトの設定 > サービスアカウント から秘密鍵を発行してパスを指定
GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json node seed.js
```

`scripts/seed-data.json` を編集すれば、投入されるサンプルの作品・プロフィール・スキルの内容を変更できます。

## Firestore構成

| コレクション | ドキュメントID | 内容 |
| --- | --- | --- |
| `profiles` | `main` | `name` `title` `tagline` `description` `bio` `career[]` `strengths[]` `futureGoals` |
| `works` | 自動採番 | `title` `category` `summary` `description` `background` `effort` `techStack[]` `tags[]` `github` `liveUrl` `docUrl` `thumbnailUrl` `order` `published` `createdAt` `updatedAt` |
| `skills` | 自動採番(カテゴリ単位) | `category` `order` `items[]` |
| `socials` | `main` | `github` `note` `x` `linkedin` `youtube` `email` |
| `settings` | (予備) | 将来的なサイト全体設定用に確保(現状未使用) |

`works.category` は `アプリ` / `Webサイト` / `資料` / `業務改善` / `AI` の固定リストです(`js/data/works.js` の `CATEGORIES` で管理)。増やしたい場合はこの配列を編集してください。

公開ページは `published == true` の作品のみを取得します。並び順は `order` の昇順で、管理画面の作品一覧でドラッグ&ドロップすると自動的に更新されます。

## Storage構成

| パス | 用途 |
| --- | --- |
| `profile/` | プロフィール画像用(現状UIからのアップロードは未実装。将来的な拡張用に予約) |
| `works/{workId}/thumbnail-*` | 各作品のサムネイル画像。管理画面の作品編集フォームからアップロードすると自動生成されます |

画像はどちらのパスも公開読み取り可・書き込みは管理者のみ(`storage.rules`)。8MB以下の画像ファイルのみアップロード可能です。

## メール送信機能(お問い合わせフォーム)の設定方法

お問い合わせフォームは [EmailJS](https://www.emailjs.com/) を使い、ブラウザから直接メールを送信します(Firebase Cloud Functions不要・Firebaseの無料プランのままで運用できます)。Firestoreへの保存は行いません。

1. EmailJSでアカウントを作成します。
2. **Email Services** で送信元サービス(Gmailなど)を追加し、`Service ID` を控えます。
3. **Email Templates** でテンプレートを作成します。フォームからは `from_name` `reply_to` `subject` `message` という変数名で送信されるので、テンプレート本文でこれらを使ってください。送信先は `tak.sobr@gmail.com` 宛に固定で設定してください。
4. **Account > General** で `Public Key` を控えます。
5. `js/config.js` の `emailjsConfig` に `publicKey` / `serviceId` / `templateId` を入力します。
6. EmailJSダッシュボードの **Allowed origins** に、本番のドメイン(例: `https://your-project.web.app`)を登録し、想定外のドメインからの送信を防いでください。

## デプロイ手順

```bash
npm install -g firebase-tools   # 未インストールの場合
firebase login
firebase use YOUR_FIREBASE_PROJECT_ID   # .firebaserc を設定済みなら不要
firebase deploy
```

初回デプロイ後、以下も忘れずに行ってください。

- `robots.txt` と `sitemap.xml` の `__SITE_DOMAIN__` を、実際に公開するドメイン(Firebase Hostingのデフォルトドメイン、またはカスタムドメイン)に置き換えてください。
- GitHubにpushする場合は、通常どおり `git push` してください。`js/config.js` は `.gitignore` 対象のため、誤って秘密情報がコミットされることはありません。

### GitHub Actionsで自動デプロイしたい場合(任意)

`firebase init hosting:github` を実行すると、`main` へのマージをトリガーにFirebase Hostingへ自動デプロイするワークフローを生成できます。実行すると必要なサービスアカウントのシークレットがGitHubリポジトリに自動登録されます。

## 管理画面の使い方

1. `https://<あなたのドメイン>/admin/` にアクセスします。
2. 「Googleでログイン」から、`js/config.js` の `adminEmail` と同じGoogleアカウントでログインします(別アカウントでログインした場合は自動的にサインアウトされ、権限がない旨が表示されます)。
3. **Dashboard**: 総作品数とカテゴリ別件数を確認できます。
4. **作品管理**:
   - 「+ 新規追加」から作品を作成できます。タイトル・カテゴリ・概要・詳細説明・作成背景・工夫した点・使用技術・タグ・GitHub/公開URL/資料URL・サムネイル画像・表示順・公開設定を入力できます。
   - 一覧画面の行をドラッグ&ドロップすると表示順を変更できます。
   - 「公開中 / 非公開」のピルをクリックすると公開状態を即座に切り替えられます。
   - 「削除」は確認ダイアログの後に完全に削除されます(元に戻せません)。
5. **プロフィール**: 名前・肩書き・キャッチコピー・トップページの説明文・自己紹介・得意分野・経歴(複数追加可)・今後挑戦したいことを編集できます。
6. **スキル**: カテゴリを追加し、各カテゴリにタグ形式でスキルを追加できます。カテゴリの並び替えは ↑↓ ボタンで行います。
7. **SNS**: GitHub / note / X / LinkedIn / YouTube / メールアドレスのリンクを編集できます。ヘッダー・フッターのアイコンに反映されます。

## 既知の制約

- `sitemap.xml` は静的ページのみを列挙しています。作品詳細ページ(`work.html?id=...`)はFirestoreの内容に応じて動的に増減するため、ビルドステップなしでは自動生成できません。必要であれば `scripts/` に生成スクリプトを追加してください。
- OGPの `og:image` などは相対パスで記述しているページがあります。SNS側のクローラーによっては絶対URLが必須の場合があるため、必要に応じて実際のドメインに書き換えてください。
- プロフィール画像(`profile/`)のアップロードUIは未実装です(Storageのパス・ルールのみ用意済み)。
