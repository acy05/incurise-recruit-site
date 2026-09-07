import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

const route = "comment-revision/";
const viewports = [
  { width: 1920, height: 1080 },
  { width: 1512, height: 982 },
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 820, height: 1180 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
] as const;

test("comment revision fits all target viewports", async ({ page }) => {
  test.setTimeout(90_000);
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator(".cr2-site")).toBeVisible();
    await expect(page.locator("#cr2-main")).toContainText("さらなる成長と成功へ、");
    const overflow = await page.evaluate(() => ({
      body: document.body.scrollWidth - window.innerWidth,
      root: document.documentElement.scrollWidth - window.innerWidth,
    }));
    expect(overflow.body).toBeLessThanOrEqual(0);
    expect(overflow.root).toBeLessThanOrEqual(0);
  }
});

test("#9 matches the official About Definition structure at desktop and mobile", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const values = await page.locator("#cr2-about").evaluate((section) => {
      const exact = section.querySelector<HTMLElement>(".cr2-official-definition")!;
      const wrap = exact.querySelector<HTMLElement>(".cr2-official-definition-wrap")!;
      const circle = exact.querySelector<HTMLElement>(".cr2-official-static")!;
      const content = exact.querySelector<HTMLElement>(".cr2-official-definition-content")!;
      const heading = content.querySelector<HTMLElement>("h3")!;
      const rect = (node: Element) => node.getBoundingClientRect();
      const normalized = (node: Element) => node.textContent?.replace(/\s+/g, " ").trim();
      return {
        sectionBackground: getComputedStyle(section).backgroundColor,
        exactHeight: rect(exact).height,
        wrap: { x: rect(wrap).x, width: rect(wrap).width },
        circle: { x: rect(circle).x, width: rect(circle).width, height: rect(circle).height },
        content: { x: rect(content).x, width: rect(content).width },
        heading: normalized(heading),
        headingSize: getComputedStyle(heading).fontSize,
        headingStyle: getComputedStyle(heading).fontStyle,
        dna: normalized(circle),
        itemCount: content.querySelectorAll("li").length,
        titles: Array.from(content.querySelectorAll(".cr2-official-definition-title"), normalized),
        paragraphs: Array.from(content.querySelectorAll("li > p"), normalized),
        oldCompositionCount: section.querySelectorAll(".cr2-iketeru-body, .cr2-definition-list, .cr2-dna-visual").length,
      };
    });

    expect(values.sectionBackground).toBe("rgb(241, 241, 241)");
    expect(values.heading).toBe("DEFINITION 〜 IKETERUの定義 〜");
    expect(values.headingStyle).toBe("italic");
    expect(values.dna).toBe("“IKETERU”の探求");
    expect(values.itemCount).toBe(6);
    expect(values.titles).toEqual([
      "自信(Confidence)がある人が“IKETERU”",
      "誠実(Integrity)な人が“IKETERU”",
      "貪欲(Hungry)な人が“IKETERU”",
      "行動力(Proactivity)がある人が“IKETERU”",
      "柔軟性(Flexibility)がある人が“IKETERU”",
      "格好(Style)がいい人が“IKETERU”",
    ]);
    expect(values.paragraphs).toHaveLength(12);
    expect(values.oldCompositionCount).toBe(0);

    if (viewport.width === 1440) {
      expect(values.exactHeight).toBeCloseTo(2129.6, -1);
      expect(values.wrap.x).toBeCloseTo(80, 0);
      expect(values.wrap.width).toBeCloseTo(1280, 0);
      expect(values.circle.x).toBeCloseTo(128.5, 0);
      expect(values.circle.width).toBeCloseTo(440, 0);
      expect(values.content.x).toBeCloseTo(626.5, 0);
      expect(values.content.width).toBeCloseTo(685, 0);
      expect(values.headingSize).toBe("64px");
    } else {
      expect(values.exactHeight).toBeCloseTo(3317.1, -1);
      expect(values.wrap.x).toBeCloseTo(0, 0);
      expect(values.wrap.width).toBeCloseTo(390, 0);
      expect(values.circle.x).toBeCloseTo(20, 0);
      expect(values.circle.width).toBeCloseTo(350, 0);
      expect(values.content.x).toBeCloseTo(20, 0);
      expect(values.content.width).toBeCloseTo(350, 0);
      expect(values.headingSize).toBe("42px");
    }
  }
});

test("#9 reproduces the official scroll motion and honors reduced motion", async ({ browser }) => {
  const animatedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  const animatedPage = await animatedContext.newPage();
  await animatedPage.goto(route, { waitUntil: "networkidle" });
  await expect(animatedPage.locator(".cr2-site")).toHaveAttribute("data-motion-ready", "enabled");

  const definitionTop = await animatedPage.locator(".cr2-official-definition").evaluate((element) => element.getBoundingClientRect().top + scrollY);
  await animatedPage.evaluate((top) => scrollTo(0, top + 650), definitionTop);
  await animatedPage.waitForTimeout(550);
  const animated = await animatedPage.evaluate(() => {
    const circle = document.querySelector<HTMLElement>(".cr2-official-static")!;
    const dna = document.querySelector<HTMLElement>(".cr2-official-definition-dna")!;
    const blob = document.querySelector<HTMLElement>(".cr2-official-blob")!;
    return {
      circleY: circle.getBoundingClientRect().y,
      dnaY: dna.getBoundingClientRect().y,
      blobScale: Number.parseFloat(getComputedStyle(blob).getPropertyValue("--cr2-blob-scale")),
      blobTravel: Number.parseFloat(getComputedStyle(blob).getPropertyValue("--cr2-blob-y")),
    };
  });
  expect(animated.circleY).toBeCloseTo(190, 0);
  expect(animated.dnaY).toBeCloseTo(190, 0);
  expect(animated.blobScale).toBeCloseTo(1, 1);
  expect(animated.blobTravel).toBeGreaterThan(0);
  await animatedContext.close();

  const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(route, { waitUntil: "networkidle" });
  await expect(reducedPage.locator(".cr2-site")).toHaveAttribute("data-motion-ready", "reduced");
  await expect(reducedPage.locator(".cr2-e-copy")).toHaveCSS("opacity", "1");
  await expect(reducedPage.locator(".cr2-e-label")).toHaveCSS("animation-name", "none");
  await expect(reducedPage.locator(".cr2-official-blob")).toHaveCSS("opacity", "1");
  await reducedContext.close();
});

test("career tabs show one exact route and support uses the adopted editorial chapters", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route, { waitUntil: "domcontentloaded" });

  const career = page.locator("#cr2-career");
  await expect(career.getByRole("tab", { name: "SEプロフェッショナル" })).toHaveAttribute("aria-selected", "true");
  await expect(career.getByRole("tabpanel")).toContainText("Tech Lead");
  await expect(career.getByRole("tabpanel")).not.toContainText("Associate");
  await expect(career).not.toContainText("万円");

  const consultantTab = career.getByRole("tab", { name: "コンサルタントプロフェッショナル" });
  await consultantTab.click();
  await expect(consultantTab).toHaveAttribute("aria-selected", "true");
  await expect(career.getByRole("tabpanel")).toContainText("Senior Consultant");
  await expect(career.getByRole("tabpanel")).not.toContainText("Tech Lead");

  await consultantTab.press("ArrowLeft");
  await expect(career.getByRole("tab", { name: "SEプロフェッショナル" })).toBeFocused();
  await expect(career.getByRole("tabpanel")).toContainText("SE Lead");

  const support = page.locator("#cr2-support");
  const chapters = support.locator(".cr2-support-chapters > article");
  await expect(chapters).toHaveCount(3);
  await expect(support.locator(".cr2-support-chapter-intro h3").filter({ hasText: /^Learning & Career$/ })).toBeVisible();
  await expect(support.locator(".cr2-support-chapter-intro h3").filter({ hasText: /^Connection & Culture$/ })).toBeVisible();
  await expect(support.locator(".cr2-support-chapter-intro h3").filter({ hasText: /^Time Off & Lifestyle$/ })).toBeVisible();
  await expect(support).not.toContainText("学び・キャリア");
  await expect(support).not.toContainText("つながり・文化");
  await expect(support).not.toContainText("休暇・暮らし");
  await expect(support.locator(".cr2-support-chapter-toggle").first()).toBeHidden();
  await expect(support.getByRole("tabpanel")).toHaveCount(3);
  await expect(support.locator("#cr2-support-detail-learn")).toContainText("プログラミング研修");
  await expect(support.locator("#cr2-support-detail-connect")).toContainText("ちょ、帰社する？制度");
  await expect(support.locator("#cr2-support-detail-life")).toContainText("各種休暇");

  const mentorText = "あなたのキャリア形成の後押し役として、役員が直接相談にのります。";
  const mentorTab = support.getByRole("tab", { name: "メンター制度" });
  await mentorTab.focus();
  await expect(mentorTab).toHaveAttribute("aria-selected", "true");
  await expect(support.locator("#cr2-support-detail-learn").getByText(mentorText, { exact: true })).toBeVisible();

  await mentorTab.press("ArrowDown");
  const supporterTab = support.getByRole("tab", { name: "サポーター制度" });
  await expect(supporterTab).toBeFocused();
  await expect(supporterTab).toHaveAttribute("aria-selected", "true");
  await expect(support.locator("#cr2-support-detail-learn")).toContainText("全新入社員に1人、先輩社員がサポーターとしてアサインされます。");

  await supporterTab.press("End");
  const consultantTabInSupport = support.getByRole("tab", { name: "IKETERU Consultant制度" });
  await expect(consultantTabInSupport).toBeFocused();
  await expect(consultantTabInSupport).toHaveAttribute("aria-selected", "true");

  for (const tab of await support.getByRole("tab").all()) {
    await expect(tab).not.toContainText(/^\d{2}$/);
    await expect(tab).not.toContainText(/[＋−]/);
  }
});

test("support chapters collapse to one open editorial chapter on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: "domcontentloaded" });

  const support = page.locator("#cr2-support");
  const toggles = support.locator(".cr2-support-chapter-toggle");
  await expect(toggles).toHaveCount(3);

  const learnToggle = toggles.nth(0);
  const connectToggle = toggles.nth(1);
  const lifeToggle = toggles.nth(2);
  await expect(learnToggle.locator("strong")).toHaveText("Learning & Career");
  await expect(connectToggle.locator("strong")).toHaveText("Connection & Culture");
  await expect(lifeToggle.locator("strong")).toHaveText("Time Off & Lifestyle");
  await expect(learnToggle).toHaveAttribute("aria-expanded", "true");
  await expect(connectToggle).toHaveAttribute("aria-expanded", "false");
  await expect(lifeToggle).toHaveAttribute("aria-expanded", "false");
  await expect(support.locator("#cr2-support-chapter-learn")).toBeVisible();
  await expect(support.locator("#cr2-support-chapter-connect")).toBeHidden();
  await expect(support.locator("#cr2-support-chapter-life")).toBeHidden();

  await connectToggle.click();
  await expect(learnToggle).toHaveAttribute("aria-expanded", "false");
  await expect(connectToggle).toHaveAttribute("aria-expanded", "true");
  await expect(lifeToggle).toHaveAttribute("aria-expanded", "false");
  await expect(support.locator("#cr2-support-chapter-learn")).toBeHidden();
  await expect(support.locator("#cr2-support-chapter-connect")).toBeVisible();

  const eventTab = support.getByRole("tab", { name: "イベント制度" });
  await eventTab.click();
  await expect(eventTab).toHaveAttribute("aria-selected", "true");
  expect((await eventTab.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await expect(support.locator("#cr2-support-detail-connect")).toContainText("隔月で役員も参加するイベントを開催しています。");
  await expect(support.locator("#cr2-support-detail-connect")).toContainText("BBQやゲーム大会などを通して、様々なメンバーと交流することができます。");
  await expect(support.locator("#cr2-support-chapter-connect").getByRole("tab", { selected: true })).toHaveCount(1);
});

test("exact FAQ text opens without rewriting", async ({ page }) => {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  const faq = page.locator("#cr2-faq");
  const firstQuestion = faq.getByRole("button", { name: "Q1.未経験でも応募することはできますか" });
  const firstAnswer = faq.locator("#cr2-faq-answer-0");
  await firstQuestion.click();
  await expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
  await expect(firstAnswer).toHaveCSS("grid-template-rows", /[^0].*px/);
  await expect(faq.getByText("はい。インキュライズでは、まずSEとして経験を積み、そこからコンサルタントへとキャリアアップしていく道を用意しています", { exact: true })).toBeVisible();
  await expect(faq.getByText("入社後はJavaを中心とした3ヶ月間の研修に集中できる環境が整っており、業界未経験の方でも着実にステップを踏んでいただけます", { exact: true })).toBeVisible();

  await faq.getByRole("button", { name: "Q3.配属やプロジェクトはどのように決まりますか？" }).click();
  await expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
  await expect(firstAnswer).toHaveAttribute("aria-hidden", "true");
  await expect(faq.getByText("営業担当が、希望に沿った案件情報を集めます", { exact: true })).toBeVisible();
  await expect(faq.getByText("クライアント企業との面談を経て、アサイン先が決まります", { exact: true })).toBeVisible();
});

test("comment 38 labels, header spacing, logo link, and selection arrows are present", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route, { waitUntil: "domcontentloaded" });
  const labels = page.locator(".cr2-official-label");
  await expect(labels).toHaveCount(6);
  await expect(labels).toContainText([
    "ABOUT / IKETERU",
    "CAREER PATH / 02",
    "SUPPORT & BENEFIT / 03",
    "JOBS / 04",
    "FAQ / 05",
    "ENTRY / 06",
  ]);
  await expect(labels.locator(".cr2-official-mark i")).toHaveCount(6);
  await expect(page.locator(".cr2-desktop-nav button").first()).toHaveCSS("font-size", "13px");
  for (const width of [1200, 1280, 1440, 1512, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    const labels = await page.locator(".cr2-desktop-nav button").evaluateAll((buttons) => buttons.map((button) => {
      const range = document.createRange();
      range.selectNodeContents(button);
      const rect = range.getBoundingClientRect();
      return { left: rect.left, right: rect.right };
    }));
    const gaps = labels.slice(1).map((label, index) => label.left - labels[index].right);
    expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThanOrEqual(.5);
    for (const gap of gaps) expect(Math.abs(gap - 40)).toBeLessThanOrEqual(.5);
  }
  const brand = page.locator(".cr2-brand");
  await expect(brand).toHaveAttribute("href", "https://incurise.co.jp/");
  await expect(brand.locator("img")).toHaveCSS("width", "142px");
  await expect(brand.locator("span")).toHaveCSS("font-size", "13px");
  await expect(page.locator(".cr2-selection-arrow")).toHaveCount(3);
});

test("adopted E hero retains the approved copy, centered layout and official arrows", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator(".cr2-growth-sequence")).toHaveCount(0);
    await expect(page.locator(".cr2-e-label")).toHaveText("技術と人で、企業の変革を支える。");
    await expect(page.locator(".cr2-e-lead")).toContainText("ITコンサルティングとシステム開発で、企業の挑戦を支える。");
    await expect(page.locator(".cr2-e-line strong").first()).toHaveCSS("font-weight", "900");
    const headingArrow = page.locator(".cr2-e-line img").first();
    const officialArrowData = readFileSync(new URL("../src/assets/preview/growth-arrow.png", import.meta.url)).toString("base64");
    await expect(headingArrow).toHaveAttribute("src", `data:image/png;base64,${officialArrowData}`);
    await expect(headingArrow).toHaveCSS("filter", "brightness(0) invert(1)");
    const headingAngle = await headingArrow.evaluate((node) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
      return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    });
    expect(headingAngle).toBeCloseTo(-40, 1);
    const cta = page.locator(".cr2-e-bottom a");
    await expect(cta).toHaveAttribute("href", "https://incurise.co.jp/about/");
    await expect(cta).toHaveCSS("min-height", viewport.width === 1440 ? "64px" : "58px");
    // Wait for entrance transforms before measuring the optical text group.
    await expect(page.locator(".cr2-e-bottom")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
    const geometry = await page.evaluate(() => {
      const hero = document.querySelector(".cr2-adopted-hero")!.getBoundingClientRect();
      const label = document.querySelector(".cr2-e-label")!.getBoundingClientRect();
      const button = document.querySelector(".cr2-e-bottom a")!.getBoundingClientRect();
      return { x: label.x + label.width / 2 - (hero.x + hero.width / 2), y: (label.top + button.bottom) / 2 - (hero.top + hero.height / 2) };
    });
    expect(Math.abs(geometry.x)).toBeLessThan(.5);
    expect(Math.abs(geometry.y)).toBeLessThan(.5);
  }
});

test("form validates, confirms files, and keeps final submission disabled", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto(route, { waitUntil: "domcontentloaded" });
  const form = page.locator(".cr2-form");
  await form.getByRole("button", { name: "同意して入力内容の確認へ" }).click();
  await expect(form.locator("input[name='name']")).toBeFocused();
  await expect(form.getByText("氏名を入力してください", { exact: true })).toBeVisible();

  await form.locator("input[name='name']").fill("山田 太郎");
  await form.locator("input[name='kana']").fill("やまだ たろう");
  await form.locator("select[name='birthYear']").selectOption("1990");
  await form.locator("select[name='birthMonth']").selectOption("1");
  await form.locator("select[name='birthDay']").selectOption("2");
  await form.locator("input[name='gender'][value='回答しない']").check();
  await form.locator("input[name='phone']").fill("090-1234-5678");
  await form.locator("input[name='email']").fill("test@example.com");
  await form.locator("input[name='address']").fill("東京都港区三田1-3-33");
  await form.locator("input[name='resume']").setInputFiles({ name: "resume.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 test") });
  await form.locator("input[name='workHistory']").setInputFiles({ name: "work-history.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 test") });
  await form.locator("input[name='privacy']").check();
  await form.getByRole("button", { name: "同意して入力内容の確認へ" }).click();

  const dialog = page.getByRole("dialog", { name: "入力内容の確認" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("resume.pdf");
  await expect(dialog).toContainText("work-history.pdf");
  await expect(dialog.getByText("プレビューのため応募情報は送信されません", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "応募する（プレビュー）" })).toBeDisabled();
  await expect(page.locator(".cr2-site")).toHaveJSProperty("inert", true);
  expect(await dialog.evaluate((element) => element.parentElement?.parentElement === document.body)).toBe(true);
  await dialog.getByRole("button", { name: "修正する", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "確認画面を閉じる" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.locator(".cr2-site")).toHaveJSProperty("inert", false);
  await expect(form.getByRole("button", { name: "同意して入力内容の確認へ" })).toBeFocused();
});

test("reviewed typography fits narrow cards and desktop side headings", async ({ page }) => {
  test.setTimeout(60_000);
  for (const width of [320, 390, 820, 1100, 1199, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route, { waitUntil: "networkidle" });
    await page.locator("#cr2-career-tab-consultant").click();
    const measurements = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll<HTMLElement>(".cr2-career-panel li strong, .cr2-support-chapter-content, .cr2-support-detail, .cr2-form")];
      const heading = (selector: string) => {
        const el = document.querySelector<HTMLElement>(selector)!;
        return el.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(el).lineHeight);
      };
      return {
        overflow: nodes.filter(el => el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1).map(el => el.className || el.textContent),
        careerLines: heading("#cr2-career h2"), supportLines: heading("#cr2-support h2"),
        faqLines: heading("#cr2-faq h2"), entryLines: heading("#cr2-entry h2"),
        inputSize: getComputedStyle(document.querySelector("input[name='name']")!).fontSize,
      };
    });
    expect(measurements.overflow).toEqual([]);
    expect(measurements.careerLines).toBeLessThanOrEqual(2.1);
    expect(measurements.supportLines).toBeLessThanOrEqual(2.1);
    expect(measurements.entryLines).toBeLessThanOrEqual(2.1);
    if (width === 1440) expect(measurements.faqLines).toBeLessThanOrEqual(1.1);
    expect(measurements.inputSize).toBe("16px");
  }
});

test("mobile menu traps focus, restores scroll and closes on desktop resize", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);
  const trigger = page.locator(".cr2-menu-button");
  const menu = page.locator("#cr2-mobile-navigation");
  await trigger.click();
  await expect(page.locator("#cr2-main")).toHaveJSProperty("inert", true);
  await expect(menu.getByRole("button").first()).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(menu.getByRole("button").last()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("#cr2-main")).toHaveJSProperty("inert", false);
  await trigger.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator("body")).not.toHaveClass(/cr2-menu-open/);
  await expect(page.locator("#cr2-main")).toHaveJSProperty("inert", false);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await menu.getByRole("button", { name: "03 SUPPORT & BENEFIT", exact: true }).click();
  await expect(page.locator("#cr2-support")).toBeFocused();
  await expect.poll(() => page.locator("#cr2-support").evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(86);
});

test("mobile support can close completely without an empty detail area", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);
  const toggle = page.locator(".cr2-support-chapter-toggle").first();
  const shell = page.locator("#cr2-support-chapter-learn");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(shell).toBeHidden();
  await expect.poll(() => shell.evaluate(el => el.getBoundingClientRect().height)).toBe(0);
  await toggle.press("Enter");
  await expect(shell).toBeVisible();
  await expect(shell.getByRole("tabpanel")).toContainText("プログラミングスキルを継続的に学ぶ環境を提供しています。");
  const footerLinks = await page.locator(".cr2-footer-bottom nav a").evaluateAll(nodes => nodes.map(el => ({y: Math.round(el.getBoundingClientRect().y), height:el.getBoundingClientRect().height})));
  expect(new Set(footerLinks.map(link => link.y)).size).toBe(2);
  expect(footerLinks.every(link => link.height >= 44)).toBe(true);
});

test("scroll motion responds to live reduced-motion and breakpoint changes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(route, { waitUntil: "networkidle" });
  await expect(page.locator(".cr2-site")).toHaveAttribute("data-motion-ready", "enabled");
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await page.setViewportSize({ width: 820, height: 1180 });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".cr2-site")).toHaveAttribute("data-motion-ready", "reduced");
  for (const selector of [".cr2-iketeru-intro", ".cr2-career-shell", ".cr2-faq-list", ".cr2-form"]) {
    await expect(page.locator(selector)).toHaveCSS("opacity", "1");
    await expect(page.locator(selector)).toHaveCSS("transform", "none");
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".cr2-site")).toHaveAttribute("data-motion-ready", "enabled");
});
