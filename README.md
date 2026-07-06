# mypage

個人の作品を公開するための、シンプルな静的ポートフォリオサイトです。
HTML / CSS / JavaScript のみで構成されており、ビルドツールは不要です。

## 構成

```
index.html   トップページ(名前・肩書き・タグライン・作品一覧)
style.css    デザイントークンに基づくスタイル
script.js    works.json を読み込んで作品一覧を描画する
works.json   作品データ(配列)
```

## 作品の追加・編集方法

`works.json` に以下の形式でオブジェクトを追記するだけで、トップページの一覧に反映されます。

```json
{
  "title": "作品名",
  "description": "1〜2行程度の説明文",
  "tags": ["タグ1", "タグ2"],
  "url": "https://example.com/your-work",
  "date": "2026-07",
  "image": ""
}
```

- `date` は `YYYY-MM` 形式で入力してください。一覧は日付の新しい順に自動で並び替えられます。
- `image` は将来サムネイル画像を表示するための予約フィールドです。画像URLを指定すると作品タイトルの上にサムネイルが表示されます。未使用の場合は空文字のままで問題ありません。
- 作品を削除したい場合は、該当するオブジェクトを配列から取り除いてください。
- JSON の形式が壊れている、または `works.json` の取得に失敗した場合は、一覧欄にエラーメッセージが表示されます。作品が0件の場合も同様にメッセージが表示されます。

## ローカルでの確認

`fetch` で `works.json` を読み込むため、`file://` で直接開くとブラウザによってはCORSエラーになります。簡易サーバーを起動して確認してください。

```bash
python3 -m http.server 8000
# http://localhost:8000 にアクセス
```

## デプロイ手順(GitHub Pages)

1. このリポジトリを GitHub にプッシュします。
2. GitHub のリポジトリページで **Settings > Pages** を開きます。
3. **Build and deployment** の **Source** を `Deploy from a branch` に設定します。
4. **Branch** で公開したいブランチ(例: `main`)と、ディレクトリに `/ (root)` を選択して **Save** します。
5. 数分待つと `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます。
6. `works.json` を更新して該当ブランチにプッシュすると、自動的にサイトへ反映されます。

### Netlify / Vercel を使う場合

- どちらもビルドコマンドは不要です(Netlify: Build command 空欄 / Publish directory `.`、Vercel: Framework Preset `Other`)。
- リポジトリを連携するだけでデプロイでき、push のたびに自動で再デプロイされます。
