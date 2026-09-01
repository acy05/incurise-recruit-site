# 採用応募フォーム Contact Form 7 設定票

採用サイトは、採用専用の Contact Form 7 フォームへ `multipart/form-data` で送信します。既存の一般問い合わせフォームは流用しません。設定が完了するまで公開サイトの確認画面は利用できますが、最終送信ボタンは「準備中」として無効になります。

## 1. WordPressで採用専用フォームを作成

Contact Form 7で新しいフォームを作り、次のタグ名をそのまま使用してください。

```text
[text* applicant-name]
[text* applicant-kana]
[number* birth-year min:1900 max:2100]
[number* birth-month min:1 max:12]
[number* birth-day min:1 max:31]
[radio gender use_label_element "男性" "女性" "その他" "回答しない"]
[tel* tel]
[email* email]
[text* address]
[file* resume filetypes:pdf limit:5mb]
[file* work-history filetypes:pdf limit:5mb]
[file other-document filetypes:pdf limit:5mb]
[acceptance privacy-consent]
[submit "応募する"]
```

画面側は年月日の3つの選択肢ですが、REST送信値を拒否しないようCF7側は数値フィールドにします。存在しない日付や採用対象年齢の検証が必要な場合はCF7のカスタムバリデーションを追加してください。ブラウザ側だけに依存せず、PDF形式・各5MB以内、必須項目をContact Form 7側でも検証します。

## 2. メール設定

- 送信先: `recruit@incurise.co.jp`
- From: `incurise.co.jp`ドメインの既存・認証済み固定アドレス（例: `Incurise Recruit <wordpress@incurise.co.jp>`）
- Reply-To: `[email]`
- 件名例: `【採用応募】[applicant-name] 様`

本文例:

```text
採用サイトから応募がありました。

氏名: [applicant-name]
ふりがな: [applicant-kana]
生年月日: [birth-year]年[birth-month]月[birth-day]日
性別: [gender]
電話番号: [tel]
メールアドレス: [email]
住所: [address]
```

「ファイル添付」欄には、1行ずつ次を設定します。

```text
[resume]
[work-history]
[other-document]
```

Fromは応募者のメールアドレスにしないでください。応募者アドレスはReply-Toだけに設定し、SPF・DKIM・DMARCが正常であることを確認します。

## 3. 保存・一時ファイル

- WordPress DBやFlamingoへ応募内容を保存しません。
- Flamingoが有効な場合、このフォームへ追加設定 `do_not_store: true` を設定します。
- Contact Form 7が一時アップロードしたファイルは、メール添付処理の完了後に削除される標準仕様を使用します。
- 採用サイト側も入力値やFileオブジェクトをLocalStorage、SessionStorage、IndexedDBへ保存しません。送信成功時だけフォームを初期化します。

## 4. Cloudflare Turnstile

WordPress管理画面の Contact Form 7 > インテグレーションからCloudflare Turnstileを設定します。

- Widget mode: Managed
- 許可ホスト: `incurise.co.jp` と `acy05.github.io`
- Secret key: WordPress側だけに保存し、GitHubやJavaScriptへ置きません
- Site key: GitHub Actions変数 `VITE_RECRUIT_TURNSTILE_SITE_KEY` に設定します

Reactは取得したトークンを `_wpcf7_turnstile_response` として送信します。期限切れ・エラー時は送信ボタンを再び無効にします。

Turnstileインテグレーションが無効なままでは、RESTへ偽トークンを直接送ってもCF7が検証しません。有効化前テストでは、トークンなし／偽トークンを専用REST URLへ直接POSTし、必ず`spam`として拒否され、`mail_sent`にならないことを確認してください。

## 5. REST URLとCORS

専用フォーム作成後、次のURLの `{FORM_ID}` を実際のフォームIDへ置き換えます。

```text
https://incurise.co.jp/wp-json/contact-form-7/v1/contact-forms/{FORM_ID}/feedback
```

WordPress側のCORS許可元に `https://acy05.github.io` を含め、`POST` と `OPTIONS`、`Content-Type` を許可してください。ワイルドカード許可は使用しません。

応募サイトは安全のため、`https://incurise.co.jp/wp-json/contact-form-7/v1/contact-forms/{数値}/feedback`と完全一致するURLだけを受け付けます。別ホスト、HTTP、プレースホルダーのままのURLでは送信を有効にしません。ReactはフォームIDからCF7必須の`_wpcf7_unit_tag`も生成します。

応募情報とPDFが別ホストへ転送されないよう、ReactはHTTPリダイレクトを拒否します。設定するURLはWordPressがリダイレクトせず直接応答する正規URLであることを、ブラウザのNetworkパネルまたは`curl`で確認してください。

GitHub Actions変数を設定します。

```bash
gh variable set VITE_RECRUIT_WPCF7_ENDPOINT --body "https://incurise.co.jp/wp-json/contact-form-7/v1/contact-forms/{FORM_ID}/feedback"
gh variable set VITE_RECRUIT_TURNSTILE_SITE_KEY --body "{TURNSTILE_SITE_KEY}"
```

Viteビルド時に環境変数が必要なため、GitHub Actionsのbuild stepで両変数を `env` として渡してください。設定後に再デプロイすると最終送信が有効になります。

## 6. 有効化前の確認

1. テスト用PDFを履歴書・職務経歴書へ1件ずつ添付する。
2. `recruit@incurise.co.jp`で受信し、3つの添付欄、件名、本文を確認する。
3. メールの返信先が応募者のメールアドレスになることを確認する。
4. PDF以外、5MB超過、必須ファイルなしがサーバー側でも拒否されることを確認する。
5. Turnstile期限切れ、spam、`validation_failed`、`mail_failed`、通信失敗の表示を確認する。
6. WordPress DB／Flamingoに応募内容が保存されていないこと、一時ファイルが残っていないことを確認する。
7. PHPの`upload_max_filesize`を5MB超、`post_max_size`とWebサーバーの本文上限を20MB超にし、3ファイル合計15MBとmultipartのオーバーヘッドを受け付けられることを確認する。
8. メール添付はbase64化で容量が増えるため、送信メールサーバーと受信側の上限内で3ファイルを受信できることを確認する。
9. WordPress側で実ファイル型を検証し、利用中のセキュリティ製品または運用手順でアップロードPDFを検査する。

参考: [Contact Form 7 ファイルアップロード](https://contactform7.com/file-uploading-and-attachment/)、[Turnstile統合](https://contactform7.com/turnstile-integration/)、[メール設定](https://contactform7.com/setting-up-mail/)
