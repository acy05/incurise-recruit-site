import { test, expect } from "@playwright/test";

for (const width of [1440, 1280, 1024, 1023, 901, 900, 768, 390, 320]) {
  test(`contact layout fits its columns and controls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 960 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("./web-production/#contact");
    await page.evaluate(() => document.fonts.ready);
    const bounds = await page.locator("#contact").evaluate(contact => {
      const box = (selector: string) => contact.querySelector(selector)!.getBoundingClientRect().toJSON();
      return {
        viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        form: box(".consultation"), copy: box(".contact-copy"),
        topics: box("fieldset"), fields: box(".consultation-fields"),
        company: box("#consultation-company"), website: box("#consultation-website"),
        message: box("#consultation-message"), submit: box(".consultation > .button"),
        padding: getComputedStyle(contact.querySelector(".consultation")!).paddingLeft,
        overflow: [...contact.querySelectorAll<HTMLInputElement>("input, textarea, button, fieldset")].filter(el => el.scrollWidth > el.clientWidth + 2).map(el => el.id || el.textContent),
      };
    });
    expect(bounds.scrollWidth).toBe(width);
    expect(bounds.overflow).toEqual([]);
    expect(bounds.form.top).toBeGreaterThanOrEqual(bounds.copy.bottom - 1);
    if (width >= 1024) {
      expect(bounds.padding).toBe("40px");
      expect(bounds.form.width).toBeGreaterThan(width * 0.8);
      expect(bounds.company.right).toBeLessThan(bounds.topics.left);
      expect(Math.abs(bounds.topics.left - bounds.message.left)).toBeLessThan(1);
      expect(Math.abs(bounds.message.left - bounds.submit.left)).toBeLessThan(1);
      expect(Math.abs(bounds.message.width - bounds.submit.width)).toBeLessThan(1);
      expect(bounds.message.height).toBeGreaterThanOrEqual(160);
      expect(bounds.submit.top).toBeGreaterThan(Math.max(bounds.message.bottom, bounds.fields.bottom));
    } else {
      expect(bounds.fields.top).toBeGreaterThanOrEqual(bounds.topics.bottom);
      expect(bounds.message.top).toBeGreaterThanOrEqual(bounds.website.bottom);
      expect(bounds.submit.top).toBeGreaterThan(bounds.message.bottom);
      await expect(page.locator(".consultation-column-heading").first()).toBeHidden();
    }
  });
}

test("desktop contact keeps the keyboard input sequence", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./web-production/#contact");
  await page.locator('.consultation input[type="radio"]:checked').focus();
  for (const selector of ["#consultation-company", "#consultation-name", "#consultation-phone", "#consultation-website", "#consultation-message", ".consultation > .button"]) {
    // macOS WebKit uses Option+Tab to include buttons in keyboard navigation.
    await page.keyboard.press(browserName === "webkit" && process.platform === "darwin" ? "Alt+Tab" : "Tab");
    await expect(page.locator(selector)).toBeFocused();
  }
});

test("desktop card grows for errors without covering the mail action", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 960 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./web-production/#contact");
  const form = page.locator(".consultation");
  const initialHeight = (await form.boundingBox())!.height;
  await page.getByRole("button", { name: "メールで無料相談する" }).click();
  await expect(page.getByRole("alert")).toHaveCount(3);
  await expect(page.locator("#consultation-company")).toBeFocused();
  expect((await form.boundingBox())!.height).toBeGreaterThan(initialHeight);
  const message = "日本語の長いご相談 & 更新・運用のご相談です。".repeat(70).slice(0, 2000);
  await page.locator("#consultation-message").fill(message);
  const body = new URL((await form.getAttribute("action"))!).searchParams.get("body");
  expect(body).toContain(message);
  const positions = await form.evaluate(el => {
    const box = (selector: string) => el.querySelector(selector)!.getBoundingClientRect();
    return { fieldsBottom: box(".consultation-fields").bottom, messageBottom: box("#consultation-message").bottom, submitTop: box(".button").top, noteTop: box(".contact-note").top, submitBottom: box(".button").bottom, formBottom: el.getBoundingClientRect().bottom, noteBottom: box(".contact-note").bottom };
  });
  expect(positions.submitTop).toBeGreaterThan(Math.max(positions.fieldsBottom, positions.messageBottom));
  expect(positions.noteTop).toBeGreaterThanOrEqual(positions.submitBottom);
  expect(positions.noteBottom).toBeLessThan(positions.formBottom);
});
