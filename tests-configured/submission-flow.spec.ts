import { expect, test, type Page, type Route } from "@playwright/test";

const cf7Endpoint = "https://incurise.co.jp/wp-json/contact-form-7/v1/contact-forms/42/feedback";

type Cf7Payload = {
  status: string;
  message: string;
  invalid_fields?: Array<{ field: string; message: string }>;
};

test.beforeEach(async ({ page }) => {
  await page.route(/\.(?:woff2?|ttf)(?:\?.*)?$/, (route) => route.abort());
  await page.route("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", (route) => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: "// Turnstile is provided by the Playwright harness.",
  }));
  await page.addInitScript(() => {
    type TurnstileOptions = Record<string, unknown>;
    const widgets: Array<{ id: string; options: TurnstileOptions }> = [];
    const callback = (options: TurnstileOptions, name: string, value?: string) => {
      const handler = options[name];
      if (typeof handler === "function") (handler as (token?: string) => void)(value);
    };

    (window as unknown as { __turnstileHarness: unknown }).__turnstileHarness = {
      expireLatest() {
        const widget = widgets.at(-1);
        if (widget) callback(widget.options, "expired-callback");
      },
      solveLatest(token = "configured-e2e-token") {
        const widget = widgets.at(-1);
        if (widget) callback(widget.options, "callback", token);
      },
      renderCount() {
        return widgets.length;
      },
    };

    (window as unknown as { turnstile: unknown }).turnstile = {
      render(element: HTMLElement, options: TurnstileOptions) {
        const id = `configured-widget-${widgets.length + 1}`;
        widgets.push({ id, options });
        element.dataset.widgetId = id;
        queueMicrotask(() => callback(options, "callback", `configured-e2e-token-${widgets.length}`));
        return id;
      },
      remove() {
        // Preserve the recorded callbacks so expiry/retry assertions can inspect them.
      },
    };
  });
});

async function fillValidApplication(page: Page) {
  await page.locator("input[name='name']").fill("山田 太郎");
  await page.locator("input[name='kana']").fill("やまだ たろう");
  await page.locator("select[name='birthYear']").selectOption("1990");
  await page.locator("select[name='birthMonth']").selectOption("4");
  await page.locator("select[name='birthDay']").selectOption("15");
  await page.locator("input[name='gender'][value='回答しない']").check();
  await page.locator("input[name='phone']").fill("090-1234-5678");
  await page.locator("input[name='email']").fill("taro@example.com");
  await page.locator("input[name='address']").fill("東京都港区三田1-3-33");
  await page.locator("input[name='resume']").setInputFiles({
    name: "resume.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 resume"),
  });
  await page.locator("input[name='workHistory']").setInputFiles({
    name: "work-history.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 work history"),
  });
  await page.locator("input[name='otherDocument']").setInputFiles({
    name: "portfolio.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 portfolio"),
  });
  await page.locator("input[name='privacy']").check();
}

async function jumpToEntry(page: Page) {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    const entry = document.querySelector<HTMLElement>("#entry");
    if (entry) window.scrollTo(0, entry.getBoundingClientRect().top + window.scrollY);
  });
}

async function openConfiguredConfirmation(page: Page) {
  await page.goto("./", { waitUntil: "domcontentloaded" });
  await jumpToEntry(page);
  await fillValidApplication(page);
  await page.getByRole("button", { name: /同意して入力内容の確認へ/ }).click();
  const dialog = page.getByRole("dialog", { name: "入力内容の確認" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("セキュリティ確認")).toHaveAttribute("data-widget-id", /configured-widget-/);
  const submit = dialog.getByTestId("recruit-submit");
  await expect(submit).toBeEnabled();
  return { dialog, submit };
}

function fulfillCf7(route: Route, payload: Cf7Payload) {
  return route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

test("configured submission posts the exact multipart payload and clears the form only after success", async ({ page }) => {
  let requestCount = 0;
  let multipart = "";
  await page.route(cf7Endpoint, async (route) => {
    requestCount += 1;
    expect(route.request().method()).toBe("POST");
    multipart = route.request().postDataBuffer()?.toString("utf8") ?? "";
    await fulfillCf7(route, { status: "mail_sent", message: "応募を受け付けました。" });
  });

  const { submit } = await openConfiguredConfirmation(page);
  await submit.click();

  await expect(page.getByRole("dialog", { name: "入力内容の確認" })).toHaveCount(0);
  await expect(page.locator(".pc-form-success")).toContainText("応募を受け付けました。");
  await expect(page.locator("input[name='name']")).toHaveValue("");
  await expect(page.locator("input[name='resume']")).toHaveValue("");
  expect(requestCount).toBe(1);
  expect(multipart).toContain('name="_wpcf7_unit_tag"');
  expect(multipart).toContain("wpcf7-f42-o1");
  expect(multipart).toContain('name="applicant-name"');
  expect(multipart).toContain("山田 太郎");
  expect(multipart).toContain('name="resume"; filename="resume.pdf"');
  expect(multipart).toContain('name="work-history"; filename="work-history.pdf"');
  expect(multipart).toContain('name="other-document"; filename="portfolio.pdf"');
  expect(multipart).toContain('name="privacy-consent"');
  expect(multipart).toContain('name="_wpcf7_turnstile_response"');
  expect(multipart).toContain("configured-e2e-token");
});

test("an expired Turnstile token disables submission until the widget supplies a fresh token", async ({ page }) => {
  let requestCount = 0;
  await page.route(cf7Endpoint, (route) => {
    requestCount += 1;
    return fulfillCf7(route, { status: "mail_sent", message: "応募を受け付けました。" });
  });

  const { dialog, submit } = await openConfiguredConfirmation(page);
  await page.evaluate(() => (window as unknown as { __turnstileHarness: { expireLatest: () => void } }).__turnstileHarness.expireLatest());
  await expect(dialog.getByRole("alert")).toContainText("有効期限が切れました");
  await expect(submit).toBeDisabled();
  expect(requestCount).toBe(0);

  await page.evaluate(() => (window as unknown as { __turnstileHarness: { solveLatest: (token: string) => void } }).__turnstileHarness.solveLatest("fresh-e2e-token"));
  await expect(dialog.getByRole("alert")).toHaveCount(0);
  await expect(submit).toBeEnabled();
});

test("CF7 validation errors return to the matching field and focus the first invalid control", async ({ page }) => {
  await page.route(cf7Endpoint, (route) => fulfillCf7(route, {
    status: "validation_failed",
    message: "入力内容を確認してください。",
    invalid_fields: [{ field: "email", message: "このメールアドレスは使用できません。" }],
  }));

  const { submit } = await openConfiguredConfirmation(page);
  await submit.click();

  await expect(page.getByRole("dialog", { name: "入力内容の確認" })).toHaveCount(0);
  const email = page.locator("input[name='email']");
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#email-error")).toHaveText("このメールアドレスは使用できません。");
});

test("a spam response keeps the application and allows a fresh Turnstile retry", async ({ page }) => {
  let attempt = 0;
  await page.route(cf7Endpoint, (route) => {
    attempt += 1;
    if (attempt === 1) return fulfillCf7(route, { status: "spam", message: "セキュリティ確認に失敗しました。もう一度お試しください。" });
    return fulfillCf7(route, { status: "mail_sent", message: "再試行で応募を受け付けました。" });
  });

  const { dialog, submit } = await openConfiguredConfirmation(page);
  await submit.click();
  await expect(dialog.getByRole("alert")).toContainText("もう一度お試しください");
  await expect(submit).toBeEnabled();
  expect(await page.evaluate(() => (window as unknown as { __turnstileHarness: { renderCount: () => number } }).__turnstileHarness.renderCount())).toBeGreaterThan(1);

  await submit.click();
  await expect(page.locator(".pc-form-success")).toContainText("再試行で応募を受け付けました。");
  expect(attempt).toBe(2);
});

test("a network failure is shown inline and can be retried without losing the application", async ({ page }) => {
  let attempt = 0;
  await page.route(cf7Endpoint, (route) => {
    attempt += 1;
    if (attempt === 1) return route.abort("connectionrefused");
    return fulfillCf7(route, { status: "mail_sent", message: "通信復旧後に応募を受け付けました。" });
  });

  const { dialog, submit } = await openConfiguredConfirmation(page);
  await submit.click();
  await expect(dialog.getByRole("alert")).toContainText("通信に失敗しました");
  await expect(submit).toBeEnabled();

  await submit.click();
  await expect(page.locator(".pc-form-success")).toContainText("通信復旧後に応募を受け付けました。");
  expect(attempt).toBe(2);
});

test("the static preview remains confirmation-only even in a configured bundle", async ({ page }) => {
  await page.goto("./preview/", { waitUntil: "domcontentloaded" });
  await jumpToEntry(page);
  await fillValidApplication(page);
  await page.getByRole("button", { name: /同意して入力内容の確認へ/ }).click();

  const dialog = page.getByRole("dialog", { name: "入力内容の確認" });
  await expect(dialog).toContainText("静止プレビューでは入力内容の確認まで利用できます");
  await expect(dialog.getByRole("button", { name: "応募する（準備中）" })).toBeDisabled();
  await expect(dialog.getByLabel("セキュリティ確認")).toHaveCount(0);
});
