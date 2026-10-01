import { expect, test } from "@playwright/test";

test("required contact fields and optional URL stop invalid mail creation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./web-production/#contact");
  await expect(page.locator(".consultation-next, .copy-button, .manual-copy")).toHaveCount(0);
  const send = page.getByRole("button", { name: "メールで無料相談する" });
  const company = page.getByLabel("会社名 必須", { exact: true });
  const name = page.getByLabel("担当者名 必須", { exact: true });
  const phone = page.getByLabel("電話番号 必須", { exact: true });
  await send.click();
  await expect(company).toBeFocused();
  await company.fill("　   ");
  await send.click();
  await expect(company).toBeFocused();
  expect(await company.evaluate((input: HTMLInputElement) => input.validity.customError)).toBe(true);
  await company.fill("株式会社サンプル");
  await send.click();
  await expect(name).toBeFocused();
  await name.fill("山田 太郎");
  await send.click();
  await expect(phone).toBeFocused();
  await phone.fill("+81 (0)3-1234-5678");
  const website = page.getByLabel("HPリンク 任意", { exact: true });
  await website.fill("invalid URL");
  await send.click();
  await expect(website).toBeFocused();
  expect(await website.evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
  await website.fill("");
  expect(await page.locator("form.consultation").evaluate((form: HTMLFormElement) => form.checkValidity())).toBe(true);
  const body = new URL((await page.locator("form.consultation").getAttribute("action"))!).searchParams.get("body");
  expect(body).not.toContain("HPリンク：");
  await expect(page).toHaveURL(/web-production\/#contact$/);
});

for (const width of [1440, 1280, 768, 390, 320]) {
  test(`main-site copy, controls and new contact fields remain readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 960 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("./web-production/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".aftercare-heading")).toContainText("OTHER SERVICES / AFTER LAUNCH");
    await expect(page.locator(".aftercare-heading")).toContainText("約40年にわたる企業支援・データ分析の経験");
    await expect(page.locator(".aftercare-list h4")).toHaveText(["運用・更新", "データ分析", "改善提案"]);
    await expect(page.locator("#approach")).not.toContainText("40年");
    await expect(page.locator(".aftercare-foot")).toContainText("別契約");
    const sizes = await page.locator(".fd-c-lead, .fd-c-choices button, .fd-cta, .service-card > p, .approach-item p, .process-grid article > p:not(.step-en), .aftercare-list p, .aftercare-heading > p, .faq-list button, .faq-answer p, .contact-copy > p, .consultation-field input, .consultation textarea, .consultation > .button").evaluateAll(elements => elements.map(element => ({ text: element.textContent?.slice(0, 30), size: parseFloat(getComputedStyle(element).fontSize) })));
    expect(sizes.filter(item => item.size < 16)).toEqual([]);
    const captions = await page.locator(".fd-c-chat > small, .fd-c-trust span, .fd-d-foot, .contact-benefits > span, .aftercare-foot small, .message-label, .message-label > span, .contact-note, .footer-bottom a").evaluateAll(elements => elements.map(element => parseFloat(getComputedStyle(element).fontSize)));
    expect(captions.filter(size => size < 14)).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const inputs = await page.locator(".consultation-field input").evaluateAll(elements => elements.map(element => ({ width: element.getBoundingClientRect().width, size: parseFloat(getComputedStyle(element).fontSize) })));
    expect(inputs.every(input => input.width > 190 && input.size >= 16)).toBe(true);
    await page.locator("#faq-question-4").click();
    await expect(page.locator("#faq-answer-4")).toContainText("日々のコンテンツ更新や保守");
  });
}
