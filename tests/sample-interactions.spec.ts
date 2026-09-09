import { test, expect, type Page } from "@playwright/test";

async function aligned(page: Page, id: string) {
  await expect.poll(() => page.locator(`#${id} [data-scroll-anchor]`).evaluate(anchor => {
    const header = document.querySelector(".ss-header")!;
    return Math.abs(anchor.getBoundingClientRect().top - header.getBoundingClientRect().bottom - 24);
  })).toBeLessThanOrEqual(1.1);
}

for (const width of [1440, 390]) {
  for (const [site, ids] of [["sora", ["about", "works", "journal"]], ["next", ["about", "people", "culture"]], ["mellow", ["story", "product", "ritual"]]] as const) {
    test(`${site} navigation lands labels below the header at ${width}px`, async ({ page }) => {
      test.setTimeout(90_000);
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(`./web-production/samples/${site}/`);
      for (const id of ids) {
        if (width < 761) await page.getByRole("button", { name: "メニューを開く", exact: true }).click();
        await page.locator(`.ss-nav a[href="#${id}"]`).click();
        await aligned(page, id);
      }
      await page.reload();
      await aligned(page, ids[2]);
      await page.locator('.ss-footer a[href="#top"]').last().click();
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      // Reusing the same hash still navigates, including with motion disabled.
      await page.getByRole("button", { name: "すべての動画とアニメーションを停止", exact: true }).click();
      if (width < 761) await page.getByRole("button", { name: "メニューを開く", exact: true }).click();
      await page.locator(`.ss-nav a[href="#${ids[0]}"]`).click();
      await aligned(page, ids[0]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }

  test(`mellow disclosures animate both ways and remain readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("./web-production/samples/mellow/#faq");
    const item = page.locator(".mellow-faq .ss-disclosure").first();
    const button = item.getByRole("button");
    const panel = item.locator(".ss-disclosure-panel");
    await expect(item).toHaveCSS("opacity", "1");
    const sample = () => item.evaluate(async node => {
      const button = node.querySelector("button")!;
      const panel = node.querySelector<HTMLElement>(".ss-disclosure-panel")!;
      const open = button.getAttribute("aria-expanded");
      button.click();
      while (button.getAttribute("aria-expanded") === open) await new Promise(resolve => setTimeout(resolve, 0));
      const animations = panel.getAnimations();
      animations.forEach(a => a.pause());
      const heights = [0, 160, 320].map(time => {
        animations.forEach(a => { a.currentTime = time; });
        return panel.getBoundingClientRect().height;
      });
      animations.forEach(a => a.finish());
      return heights;
    });
    const opening = await sample();
    expect(opening[0]).toBe(0);
    expect(opening[1]).toBeGreaterThan(1);
    expect(opening[1]).toBeLessThan(opening[2]);
    const closing = await sample();
    expect(closing[1]).toBeGreaterThan(0);
    expect(closing[1]).toBeLessThan(closing[0]);
    expect(closing[2]).toBe(0);
    await button.click();
    await page.waitForTimeout(70);
    await button.click();
    await expect(panel).toBeHidden();
    await expect(item).toHaveCSS("opacity", "1");
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(panel).toBeVisible();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await button.click();
    await expect(panel).toBeHidden();
    await expect(panel).toHaveCSS("transition-duration", "0s");
  });

  test(`next keeps the full workshop composition at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./web-production/samples/next/");
    const visual = page.locator(".next-culture-visual");
    await visual.scrollIntoViewIfNeeded();
    const photo = visual.locator("img");
    await expect(photo).toHaveCSS("transform", "none");
    const geometry = await photo.evaluate(image => {
      const rect = image.getBoundingClientRect();
      return { displayed: rect.width / rect.height, original: image.naturalWidth / image.naturalHeight };
    });
    expect(geometry.displayed).toBeCloseTo(geometry.original, 3);
    if (width < 761) {
      const imageRect = (await photo.boundingBox())!;
      const caption = (await visual.locator("p").boundingBox())!;
      expect(caption.y).toBeGreaterThanOrEqual(imageRect.y + imageRect.height - 1);
    }
  });
}

test("sample dialog links navigate after scroll locking is released", async ({ page }) => {
  await page.goto("./web-production/samples/next/#jobs");
  await page.locator(".next-job").first().click();
  await page.getByRole("dialog").getByRole("link", { name: "この職種について話す" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await aligned(page, "entry");
  await page.goto("./web-production/samples/mellow/");
  await page.getByRole("button", { name: "バッグを見る 0点" }).click();
  await page.getByRole("dialog").getByRole("link", { name: "商品を見る", exact: true }).click();
  await aligned(page, "product");
});
