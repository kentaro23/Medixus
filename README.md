# Medixus Corporate Site

株式会社MedixusのコーポレートHP静的サイトです。

## ローカル確認

```bash
python3 -m http.server 4174
```

ブラウザで `http://localhost:4174/` を開いてください。

## ページ

- `/`
- `/about/`
- `/business/`
- `/os/`
- `/news/`
- `/recruit/`
- `/ir/`
- `/contact/`
- `/privacy/`

## 編集

本文・SEO・ページ構成は `build-site.mjs` に集約しています。編集後は次を実行してください。

```bash
node build-site.mjs
```

スタイルは `assets/styles.css`、インタラクションは `assets/site.js` です。画像は生成アセットを `assets/images/` に保存し、表示側は軽量化した `.jpg` を参照しています。
