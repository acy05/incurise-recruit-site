# INCURISE Consulting Recruit Site

INCURISE Consultingの採用サイトです。React、TypeScript、Vite、GSAPで実装しています。

## ローカル開発

```bash
npm ci
npm run dev
npm run build
```

## 公開

`main` ブランチへのpushをGitHub Actionsが検知し、GitHub Pagesへ公開します。

- 公開URL: https://acy05.github.io/incurise-recruit-site/
- 静止確認版: https://acy05.github.io/incurise-recruit-site/preview/

## 応募フォーム

応募フォームはContact Form 7の採用専用RESTエンドポイントへ送信します。次のGitHub Actions変数が両方設定されるまでは、入力検証と確認画面だけが利用でき、最終送信は「準備中」として無効になります。

- `VITE_RECRUIT_WPCF7_ENDPOINT`
- `VITE_RECRUIT_TURNSTILE_SITE_KEY`

WordPress側のフォーム、メール、PDF添付、Turnstile、保存方針は [docs/recruit-cf7-setup.md](docs/recruit-cf7-setup.md) を参照してください。
