import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route(/\.(?:woff2?|ttf)(?:\?.*)?$/, (route) => route.abort());
});

const viewports = [
  { name: "1920", width: 1920, height: 1080 },
  { name: "1512", width: 1512, height: 982 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 800 },
  { name: "820", width: 820, height: 1180 },
  { name: "390", width: 390, height: 844 },
  { name: "320", width: 320, height: 568 },
] as const;

for (const viewport of viewports) {
  test(`layout ${viewport.name}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("./", { waitUntil: "domcontentloaded" });

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      html: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
      site: document.querySelector<HTMLElement>(".pc-site")?.scrollWidth ?? 0,
    }));
    expect(dimensions.html).toBeLessThanOrEqual(dimensions.viewport + 1);
    expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport + 1);
    expect(dimensions.site).toBeLessThanOrEqual(dimensions.viewport + 1);

    const blocks = await page.evaluate(() => Array.from(document.querySelectorAll("main > section, body .pc-footer"), (node) => {
      const rect = node.getBoundingClientRect();
      return { top: rect.top + scrollY, bottom: rect.bottom + scrollY, height: rect.height };
    }));
    for (const block of blocks) expect(block.height).toBeGreaterThan(0);
    for (let index = 1; index < blocks.length; index += 1) {
      expect(blocks[index].top).toBeGreaterThanOrEqual(blocks[index - 1].bottom - 1);
    }
  });
}

test("new information architecture replaces removed sections", async ({ page }) => {
  await page.goto("./", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#preview-message, #people, #starting, #benefits")).toHaveCount(0);
  await expect(page.locator("#about .pc-definition-list article")).toHaveCount(6);
  await expect(page.getByText("技術力×人間力。IKETERU人材を育てる。")).toBeVisible();
  await expect(page.locator("#support article")).toHaveCount(15);
  await expect(page.locator(".pc-selection article")).toHaveCount(4);
  await expect(page.locator(".pc-faq-list article")).toHaveCount(5);
  await expect(page.locator(".pc-hero-actions button")).toHaveCount(0);
  await expect(page.locator(".pc-nav")).not.toContainText("PEOPLE");
  await expect(page.locator(".pc-nav")).not.toContainText("BENEFITS");
});

test("static preview reuses the same site without motion UI", async ({ page }) => {
  await page.goto("./preview/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".pc-site")).toHaveAttribute("data-preview", "true");
  await expect(page.locator(".pc-scroll-progress")).toHaveCount(0);
  await expect(page.locator("#pc-hero-title")).toContainText("100の成長へ");
  await expect(page.getByRole("heading", { level: 1, name: "0から1の挑戦を、1から100の成長へ。" })).toBeVisible();
  await expect(page.locator(".pc-dna-orb")).toContainText("“IKETERU”の探求");
});

test("mobile menu traps focus, closes with Escape and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const trigger = page.getByRole("button", { name: "メニューを開く" });
  await trigger.click();
  await expect(page.locator("#mobile-navigation")).toHaveClass(/is-open/);
  await expect(page.locator("body")).toHaveClass(/pc-menu-open/);
  await expect(page.locator("#mobile-navigation")).toContainText("SUPPORT & BENEFIT");
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-navigation")).not.toHaveClass(/is-open/);
  await expect(trigger).toBeFocused();
});

test("support disclosures work with pointer and keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./");
  const first = page.locator("#support article").first();
  await first.hover();
  await expect(first.locator(".pc-support-detail")).toHaveCSS("opacity", "1");

  const thirdButton = page.getByRole("button", { name: /コンサルタント研修/ });
  await thirdButton.focus();
  await expect(thirdButton).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Enter");
  await expect(thirdButton).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await expect(thirdButton).toHaveAttribute("aria-expanded", "true");
  await expect(thirdButton.locator("xpath=..")).toHaveClass(/is-open/);
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
  await page.locator("input[name='resume']").setInputFiles({ name: "resume.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 resume") });
  await page.locator("input[name='workHistory']").setInputFiles({ name: "work-history.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 work history") });
  await page.locator("input[name='otherDocument']").setInputFiles({ name: "portfolio.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 portfolio") });
  await page.locator("input[name='privacy']").check();
}

test("form validates required fields and PDF restrictions", async ({ page }) => {
  await page.goto("./");
  await page.locator("#entry").scrollIntoViewIfNeeded();
  await expect(page.locator("select[name='birthYear']").getByRole("option", { name: "1900", exact: true })).toHaveCount(1);
  await expect(page.locator("input[name='name']")).toHaveAttribute("required", "");
  await expect(page.locator("input[name='resume']")).toHaveAttribute("required", "");
  await expect(page.locator("input[name='privacy']")).toHaveAttribute("required", "");
  await page.getByRole("button", { name: /同意して入力内容の確認へ/ }).click();
  await expect(page.locator("input[name='name']")).toBeFocused();

  await page.locator("input[name='resume']").setInputFiles({ name: "resume.txt", mimeType: "text/plain", buffer: Buffer.from("not pdf") });
  await page.locator("input[name='resume']").blur();
  await expect(page.locator("#resume-error")).toContainText("PDF形式");

  await page.locator("input[name='resume']").setInputFiles({ name: "resume.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(5 * 1024 * 1024 + 1, 0) });
  await expect(page.locator("#resume-error")).toContainText("5MB以内");
});

test("confirmation lists files, traps focus and fails closed until CF7 is configured", async ({ page }) => {
  await page.goto("./");
  await page.locator("#entry").scrollIntoViewIfNeeded();
  await fillValidApplication(page);
  const confirm = page.getByRole("button", { name: /同意して入力内容の確認へ/ });
  await confirm.click();

  const dialog = page.getByRole("dialog", { name: "入力内容の確認" });
  await expect(dialog).toBeVisible();
  await expect(page.locator("body")).toHaveClass(/pc-modal-open/);
  await expect(dialog).toContainText("resume.pdf");
  await expect(dialog).toContainText("work-history.pdf");
  await expect(dialog).toContainText("portfolio.pdf");
  await expect(dialog).toContainText("応募受付システムの準備中");
  await expect(page.getByRole("button", { name: "応募する（準備中）" })).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(confirm).toBeFocused();
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
});

test("privacy policy opens in a new tab", async ({ page }) => {
  await page.goto("./");
  const link = page.getByRole("link", { name: "個人情報の取り扱い" });
  await expect(link).toHaveAttribute("href", "https://incurise.co.jp/privacy-policy/");
  await expect(link).toHaveAttribute("target", "_blank");
});

test("reduced motion renders all content immediately", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator(".pc-site")).toHaveAttribute("data-motion-ready", "reduced");
  await expect(page.locator(".pc-scroll-progress")).toBeHidden();
  await expect(page.locator(".pc-motion-reveal").first()).toHaveCSS("opacity", "1");
});

test("motion mode reveals sections and advances scroll progress", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".pc-site")).toHaveAttribute("data-motion-ready", "true");
  await page.waitForTimeout(1_250);
  await expect(page.locator("#pc-hero-title")).toHaveCSS("opacity", "1");
  await page.locator("#career").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await expect(page.locator("#career .pc-motion-heading")).toHaveCSS("opacity", "1");
  const lineTransform = await page.locator("#career .pc-career-line").first().evaluate((node) => getComputedStyle(node).transform);
  expect(lineTransform).not.toBe("none");
  const progressScale = await page.locator(".pc-scroll-progress-bar").evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).d);
  expect(progressScale).toBeGreaterThan(.1);
});
