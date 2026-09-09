import { test, expect, type Page } from "@playwright/test";

async function usableControls(page: Page) {
  const issues = await page.evaluate(() => {
    const controls = [...document.querySelectorAll<HTMLElement>("a, button, input:not([type=radio]), select, textarea")];
    return controls.filter(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" &&
        !element.closest('[aria-hidden="true"], .ss-skip, .skip-link, .sample-site');
    }).flatMap(element => {
      const rect = element.getBoundingClientRect();
      const name = `${element.tagName} ${element.textContent?.trim().slice(0, 40)}`;
      const problems = [];
      if (rect.left < -1 || rect.right > innerWidth + 1) problems.push(`${name}: outside viewport`);
      if (rect.height < 43.5) problems.push(`${name}: tap target ${rect.height}px high`);
      return problems;
    });
  });
  expect(issues).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
}

for (const site of ["main", "sora", "next", "mellow"] as const) {
  test(`${site} fits narrow screens and keeps tablet navigation usable`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(`./web-production/${site === "main" ? "" : `samples/${site}/`}`);
    await expect(page.locator("h1")).toBeVisible({ timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);
    for (const width of [320, 768, 900]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await usableControls(page);
      const form = page.locator(site === "main" ? ".consultation textarea" : ".ss-form input").first();
      if (site !== "mellow") {
        expect((await form.boundingBox())!.width).toBeGreaterThan(230);
        expect(await form.evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);
      }
    }

    // A short landscape screen still exposes every navigation item by scrolling.
    await page.setViewportSize({ width: 768, height: 320 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    const menu = page.getByRole("button", { name: "メニューを開く", exact: true });
    await menu.click();
    const panel = page.locator(site === "main" ? "#mobile-menu" : ".ss-nav");
    expect(await panel.evaluate(element => element.getBoundingClientRect().bottom)).toBeLessThanOrEqual(320.5);
    const lastLink = panel.getByRole("link").last();
    const hash = (await lastLink.getAttribute("href"))!;
    await lastLink.click();
    await expect(panel).toBeHidden();
    const anchor = page.locator(`${hash} ${site === "main" ? ".section-label" : "[data-scroll-anchor]"}`).first();
    await expect.poll(() => anchor.evaluate((element, main) => {
      const inset = main ? 32 : document.querySelector(".ss-header")!.getBoundingClientRect().bottom + 24;
      return Math.abs(element.getBoundingClientRect().top - inset);
    }, site === "main")).toBeLessThanOrEqual(1.1);

    // Returning to desktop closes the compact menu, including its scroll lock.
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await menu.click();
    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(page.locator(site === "main" ? ".menu-button" : ".ss-menu")).toHaveAttribute("aria-expanded", "false");
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");

    await page.setViewportSize({ width: 320, height: 740 });
    if (site === "next") {
      const photo = page.locator(".next-hero-photo > img");
      const ratios = await photo.evaluate((image: HTMLImageElement) => ({
        displayed: image.getBoundingClientRect().width / image.getBoundingClientRect().height,
        original: image.naturalWidth / image.naturalHeight,
      }));
      expect(ratios.displayed).toBeCloseTo(ratios.original, 3);
      await expect(photo).toHaveCSS("transform", "none");
    }
    if (site === "mellow") {
      await page.locator(".mellow-add").click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await dialog.getByLabel("250 mLの数量").selectOption("2");
      await expect(dialog.locator(".mellow-cart-total")).toContainText("6,400");
      expect(await dialog.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
      await dialog.getByRole("button", { name: "削除", exact: true }).click();
      await expect(dialog).toContainText("バッグはまだ空です。");
    }
  });
}
