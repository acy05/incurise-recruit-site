import { expect, test } from "@playwright/test";

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
  await expect(reducedPage.locator(".cr2-hero-copy")).toHaveCSS("opacity", "1");
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
  const navCenters = await page.locator(".cr2-desktop-nav button").evaluateAll((buttons) => buttons.map((button) => {
    const rect = button.getBoundingClientRect();
    return rect.x + rect.width / 2;
  }));
  const navGaps = navCenters.slice(1).map((center, index) => center - navCenters[index]);
  expect(Math.max(...navGaps) - Math.min(...navGaps)).toBeLessThanOrEqual(.5);
  const brand = page.locator(".cr2-brand");
  await expect(brand).toHaveAttribute("href", "https://incurise.co.jp/");
  await expect(brand.locator("img")).toHaveCSS("width", "142px");
  await expect(brand.locator("span")).toHaveCSS("font-size", "13px");
  await expect(page.locator(".cr2-selection-arrow")).toHaveCount(3);
});

test("hero growth marks match the Figma asset, weight, sizes, and angle", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const expected = viewport.width === 1440
      ? { sequence: "14px", heading: "22px" }
      : { sequence: "10px", heading: "15px" };
    const sequenceArrow = page.locator(".cr2-growth-sequence img").first();
    await expect(sequenceArrow).toHaveCSS("width", expected.sequence);
    await expect(sequenceArrow).toHaveCSS("filter", "none");
    await expect(page.locator(".cr2-growth-sequence strong").first()).toHaveCSS("font-weight", "900");
    const angle = await sequenceArrow.evaluate((node) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
      return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    });
    expect(angle).toBeCloseTo(-40, 1);
    const headingArrow = page.locator(".cr2-hero-copy h1 > img").first();
    await expect(headingArrow).toHaveCSS("width", expected.heading);
    await expect(headingArrow).toHaveCSS("filter", "none");
    const headingAngle = await headingArrow.evaluate((node) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
      return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    });
    expect(headingAngle).toBeCloseTo(-40, 1);
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
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(form.getByRole("button", { name: "同意して入力内容の確認へ" })).toBeFocused();
});
