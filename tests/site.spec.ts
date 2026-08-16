import { expect, test } from "@playwright/test";

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

test("static preview reuses the site without motion UI", async ({ page }) => {
  await page.goto("./preview/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".pc-site")).toHaveAttribute("data-preview", "true");
  await expect(page.locator(".pc-scroll-progress")).toHaveCount(0);
  await expect(page.locator("#pc-hero-title")).toContainText("100の成長へ");
});

test("mobile menu traps focus, closes with Escape and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const trigger = page.getByRole("button", { name: "メニューを開く" });
  await trigger.click();
  await expect(page.locator("#mobile-navigation")).toHaveClass(/is-open/);
  await expect(page.locator("body")).toHaveClass(/pc-menu-open/);
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-navigation")).not.toHaveClass(/is-open/);
  await expect(trigger).toBeFocused();
});

test("FAQ, validation and confirm dialog are keyboard operable", async ({ page }) => {
  await page.goto("./");
  const secondFaq = page.getByRole("button", { name: /キャリアはどのように/ });
  await secondFaq.click();
  await expect(secondFaq).toHaveAttribute("aria-expanded", "true");

  await page.locator("#entry").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /入力内容を確認する/ }).click();
  await expect(page.locator("input[name='name']")).toBeFocused();
  await page.locator("input[name='name']").fill("山田 太郎");
  await page.locator("input[name='email']").fill("taro@example.com");
  await page.locator("select[name='role']").selectOption({ label: "システムエンジニア" });
  await page.locator("textarea[name='message']").fill("選考について相談したいです。");
  await page.locator("input[name='privacy']").check();
  await page.getByRole("button", { name: /入力内容を確認する/ }).click();

  const dialog = page.getByRole("dialog", { name: "入力内容の確認" });
  await expect(dialog).toBeVisible();
  await expect(page.locator("body")).toHaveClass(/pc-modal-open/);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: /入力内容を確認する/ })).toBeFocused();
});

test("reduced motion renders all content immediately", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator(".pc-site")).toHaveAttribute("data-motion-ready", "reduced");
  await expect(page.locator(".pc-scroll-progress")).toBeHidden();
  const reveal = page.locator(".pc-motion-reveal").first();
  await expect(reveal).toHaveCSS("opacity", "1");
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
  expect(progressScale).toBeGreaterThan(0.1);
});
