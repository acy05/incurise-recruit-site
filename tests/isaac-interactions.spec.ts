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
    const tilt = await page.locator(".fd-c-chat").evaluate(el => {
      const matrix = new DOMMatrix(getComputedStyle(el).transform);
      return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    });
    expect(tilt).toBeCloseTo(width > 860 ? 2 : 1, 2);
    const card = await page.locator(".fd-c-chat").boundingBox();
    const shell = await page.locator(".fd-c-chat-shell").boundingBox();
    expect(Math.abs(card!.width - shell!.width)).toBeLessThan(25);
    expect(Math.abs(card!.x + card!.width / 2 - shell!.x - shell!.width / 2)).toBeLessThan(2);
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

test("FAQ expands and collapses gradually, including an interrupted toggle", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("./web-production/");
  const question = page.locator("#faq-question-2");
  const answer = page.locator("#faq-answer-2");
  await question.scrollIntoViewIfNeeded();
  const sampleToggle = () => page.evaluate(async () => {
    const button = document.querySelector<HTMLButtonElement>("#faq-question-2")!;
    const answer = document.querySelector<HTMLElement>("#faq-answer-2")!;
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    // Wait for React to commit before sampling the compositor timeline.
    while ((button.getAttribute("aria-expanded") === "true") === expanded) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    const animations = answer.getAnimations();
    animations.forEach(animation => animation.pause());
    const values = [0, 140, 280].map(time => {
      animations.forEach(animation => { animation.currentTime = time; });
      return answer.getBoundingClientRect().height;
    });
    animations.forEach(animation => animation.finish());
    return values;
  });
  const opening = await sampleToggle();
  expect(opening[0]).toBe(0);
  const height = opening.at(-1)!;
  expect(height).toBeGreaterThan(30);
  expect(opening.some(value => value > 1 && value < height - 1)).toBe(true);
  const closing = await sampleToggle();
  expect(closing.some(value => value > 1 && value < height - 1)).toBe(true);
  expect(closing.at(-1)).toBe(0);
  await expect(answer).toBeHidden();
  await question.click();
  await page.waitForTimeout(70);
  await question.click();
  await expect(answer).toBeHidden();
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(answer).toBeVisible();
  await expect(answer).toHaveCSS("transition-duration", "0s");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await question.click();
  await expect(answer).toBeHidden();
  await expect(answer).toHaveCSS("transition-duration", "0s");
});
