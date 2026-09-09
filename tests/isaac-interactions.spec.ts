import { test, expect } from "@playwright/test";

test("FAQ stays readable when answers are repeatedly opened and closed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("./web-production/");
  const items = page.locator(".faq-list > article");
  for (const index of [1, 4, 0, 2, 3, 3, 4]) {
    const item = items.nth(index);
    const question = item.getByRole("button");
    await question.scrollIntoViewIfNeeded();
    await expect(item).toHaveCSS("opacity", "1");
    await question.click();
    await expect(item).toHaveCSS("opacity", "1");
    for (const previous of [0, 1, 4].filter(i => i <= index)) {
      const row = items.nth(previous);
      if (await row.getAttribute("data-revealed")) await expect(row).toHaveCSS("opacity", "1");
    }
  }
  await expect(page.locator("#faq-answer-4")).toBeVisible();
  await page.getByRole("button", { name: "アニメーションを一時停止", exact: true }).click();
  await page.getByRole("button", { name: "アニメーションを再生", exact: true }).click();
  await expect(items.nth(4)).toHaveCSS("opacity", "1");
});

for (const width of [1440, 390]) {
  test(`contact links align the section label at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("./web-production/");
    await expect(page.locator(".fd-c-chat")).toHaveCSS("transform", "none");
    const assertAligned = async () => {
      await expect.poll(async () => page.locator("#contact .section-label").evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(32);
      await expect(page.locator(".contact-copy")).toHaveCSS("opacity", "1");
      await expect(page.locator(".consultation")).toHaveCSS("opacity", "1");
    };
    await page.locator(".fd-c-chat .fd-cta").click();
    await assertAligned();
    // Same-hash links must still scroll correctly after going back up the page.
    await page.locator("#faq-question-4").click();
    await page.locator(".faq-heading .text-link").click();
    await assertAligned();
    await page.reload();
    await assertAligned();
    if (width < 761) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.getByRole("button", { name: "メニューを開く", exact: true }).click();
      await page.locator("#mobile-menu").getByRole("link", { name: "無料で相談する" }).click();
      await assertAligned();
    }
  });
}
