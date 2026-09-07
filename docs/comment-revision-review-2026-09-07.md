# Comment revision — 全体レビュー / 2026-09-07

対象：`/comment-revision/`。基準リビジョン：`aeb155c`。

## 維持したもの

- 採用済みE案のコピー、光学中央揃え、公式矢印、粒子・マウス・入場アニメーション。
- IRCの色、写真・ロゴ・SNS素材、公式Definitionの構図と文言。
- Careerの2ルートと英語職位、Supportの3カテゴリー構成・15制度・コメント原文、FAQ回答、4段階の選考フロー。
- 公式トップ、既存`/preview/`、比較案のデザイン、Figma。応募送信は無効のまま。

## 発見と修正

| 領域 | レビューで確認した問題 | 修正 |
| --- | --- | --- |
| 余白 | 同色セクションの上下余白が重なり、ナビ遷移もscroll-paddingとscroll-marginの二重指定 | ページ専用の余白スケール80/104/120pxと隣接間隔32/48pxへ整理。ナビはヘッダー高＋16pxに一本化 |
| 見出し | PCのFAQが「よくあ／る質問」、ENTRYが3行。スマホCAREER・SUPPORTが語の途中で改行 | カラム幅に合わせたサイズへ調整。PC FAQは1行、ENTRYとスマホ主要見出しは意図した2行 |
| 読みやすさ | 制度説明・フォーム注記・Footerが小さく、赤い小文字も背景に対して弱い | 本文・ラベルサイズを整理。小さい赤文字は可読性を優先した濃い赤。フォーム入力は16px |
| 中間幅 | DefinitionとSupportの固定列幅が1100px前後で収まりにくい | 中間幅のみ可変列。1440/390pxの公式Definition指定は維持 |
| 制度UI | 開いたカテゴリーを再タップしても閉じず、切替が瞬間的 | 再タップで閉じる。閉時の説明枠は高さ0。カテゴリー320ms、詳細・Career切替240ms |
| モバイルナビ | 閉じる動きがない。閉じるボタンがTab循環外。PCへ拡大してもスクロールロックが残る | 260msの開閉、閉じるボタン込みのTab循環、背景inert、Escapeとフォーカス復帰、幅変更時の解除 |
| モーダル | 背景の読み上げ・操作を完全には除外していない | body直下へPortal化、背景inert、スクロールロックとフォーカス復帰。240msの表示 |
| スクロール演出 | 初期画面幅とReduced Motionだけを参照。後から高さが変わると開始位置が古い | GSAP matchMediaで動的切替。フォント・レイアウトの再計測。既読コンテンツは再度隠さない |
| Footer | スマホで5項目＋1項目に折り返す | 3項目×2行、44px以上のリンク領域へ整理 |

## 検証

- 実画面：PC・390px・320px・1100pxのHero、見出し、カード、フォーム、Footerを確認。ナビ・FAQ・制度選択を操作。
- 既存のコメント・Hero E・公式Definition・応募確認テストは保持。狭幅の改行、閉じた説明枠、高さ変更、メニューとモーダルのフォーカス、動的Reduced Motion／幅変更の回帰テストを追加。
- `npm run build`成功。公開前にGitHub Actionsの既存全テストを必須とし、合格後だけPagesを更新する。
- 正式トップ・既存プレビューのソースは未編集。公開中の共通プレビューCSSとビルド出力のSHA-256は一致。JSのファイル名は共通チャンク再生成で変わり得るため、JSの同一ハッシュは主張しない。
- 実機Safari／VoiceOverでの検証や応募メール送信は実施していない。

## レビュー指針

Lazyweb経由で取得した[ImpeccableのPolish指針](https://raw.githubusercontent.com/pbakaus/impeccable/main/.agents/skills/reference/polish.md)と[Craft floor](https://raw.githubusercontent.com/pbakaus/impeccable/main/.agents/skills/reference/craft-floor.md)を使用。承認済みの構図を維持し、共通原因を直した後に確認する方針を適用した。
