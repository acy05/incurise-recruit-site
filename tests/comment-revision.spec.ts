import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

const route = "comment-revision/";
for (const width of [320, 390, 402, 430]) {
  test(`mobile About name meanings stay together at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 874 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const copy = page.locator('.cr2-iketeru-who.cr2-definition-mobile-copy');
    await expect(copy).toHaveText('「Incubate（育成・支援）」と「Rise（成長・向上）」の想いを社名に込め、課題をチャンスに変える挑戦を全力で支援します。');
    const lines = await copy.locator('.cr2-about-term').evaluateAll(elements => elements.map(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return new Set(Array.from(range.getClientRects(), rect => Math.round(rect.top))).size;
    }));
    expect(lines).toEqual([1, 1]);
    const paragraphs = page.locator('.cr2-official-definition-content li > p');
    await expect(paragraphs).toHaveCount(12);
    expect(await paragraphs.evaluateAll(elements => elements.every(element => {
      const style = getComputedStyle(element);
      return style.textAlign === 'left' && ['normal', '0px'].includes(style.letterSpacing) && style.getPropertyValue('text-wrap-style') === 'auto';
    }))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  });
}
// Explicit user revisions take priority, then comments, then uncommented design copy.
// Source: Figma 6QM5lCn22AJzsbZPUpV9Sj, checked 2026-09-09.
test("support descriptions match Figma and its comments without paraphrasing", async ({ page }) => {
  const comments = [
    [null, "learn", "01", ["Javaを中心に、入社後3カ月集中して学ぶ。"]], // Explicit user copy
    [null, "learn", "02", ["プログラミングスキルを継続的に学ぶ環境を提供しています。"]], // Explicit user copy, 2026-09-09
    [15, "learn", "03", ["コンサルタントに求められる基礎・実践スキルを早期習得するための研修が整っています。"]],
    [16, "learn", "04", ["あなたのキャリア形成の後押し役として、役員が直接相談にのります。"]],
    [17, "learn", "05", ["全新入社員に1人、先輩社員がサポーターとしてアサインされます。", "入社直後から立ち上がりまでの支援を行います。"]],
    [18, "learn", "06", ["資格試験に合格した際に、受験料とお祝い金が支給される制度です。"]],
    [29, "learn", "11", ["コンサルタントへのキャリアチェンジを成功させた方に、スーツ一式をプレゼントする制度です。"]],
    [24, "connect", "08", ["メンバーと一緒に本社に帰社した際に、飲食代を補助する制度です。食事やゲームをしながら社員同士で交流を深めることができます。"]],
    [25, "connect", "09", ["紹介された候補者が入社すると一定の報奨金が支給される制度です。"]],
    [27, "connect", "10", ["隔月で役員も参加するイベントを開催しています。", "BBQやゲーム大会などを通して、様々なメンバーと交流することができます。"]],
    [30, "connect", "12", ["経営層から全社員に向けて理念を伝え、新入社員の紹介などを行う、隔月の集会です。"]],
    [30, "connect", "13", ["年に1度全社員が集まり、経営層から翌年に向けた重要な発表があります。豪華な景品が出るビンゴ大会も開催される、特別な集会です。"]],
    [null, "life", "07", ["夏季休暇・冬期休暇、産前・産後休暇／育児休暇が利用可能です。"]], // User requests current Figma design, Desktop 345:383
    [31, "life", "14", ["住宅の賃貸・売買の際、会社と提供している不動産仲介会社を通して成約した場合、不動産仲介手数料が割引となる制度です。"]],
    [32, "life", "15", ["「たくさん歩いて健康促進」を目標に、上記テーマパークの入園料の一部を負担する制度"]],
  ] as const;
  const titles = [
    "プログラミング研修", "eラーニング", "コンサルタント研修", "メンター制度", "サポーター制度",
    "資格取得補助制度", "各種休暇", "ちょ、帰社する？制度", "リファラル採用制度", "イベント制度",
    "IKETERU Consultant制度", "全社員集会", "決起集会", "住宅仲介手数料補助制度", "ディズニー/USJ施設優待制度",
  ];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    for (const [number, group, item, paragraphs] of comments) {
      const chapter = page.locator(`[data-chapter="${group}"]`);
      const toggle = chapter.locator(".cr2-support-chapter-toggle");
      if (width === 390 && await toggle.getAttribute("aria-expanded") === "false") await toggle.click();
      const tab = page.locator(`#cr2-support-item-${group}-${item}`);
      await expect(tab).toHaveText(titles[Number(item) - 1]);
      await tab.click();
      await expect(chapter.locator(".cr2-support-detail-copy h3")).toHaveText(titles[Number(item) - 1]);
      await expect(chapter.locator(".cr2-support-detail-copy p"), number === null ? "Latest user request / Figma design" : `Figma comment #${number}`).toHaveText([...paragraphs]);
    }
  }
});

test("header, footer and mobile menu land headings at the same offset", async ({ page }) => {
  test.setTimeout(90_000);
  const names = ["ABOUT", "CAREER", "SUPPORT & BENEFIT", "JOBS", "FAQ", "ENTRY"];
  const ids = ["about", "career", "support", "jobs", "faq", "entry"];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const reducedMotion of ["no-preference", "reduce"] as const) {
      await page.emulateMedia({ reducedMotion });
      await page.goto(route);
      for (const source of ["header", "footer"]) {
        for (let index = 0; index < names.length; index++) {
          if (source === "footer") {
            await page.getByRole("navigation", { name: "フッターナビゲーション" }).getByRole("link", { name: names[index], exact: true }).click();
          } else if (width < 1200) {
            await page.locator(".cr2-menu-button").click();
            await page.locator("#cr2-mobile-navigation").getByRole("button").nth(index).click();
          } else {
            await page.locator(".cr2-header").getByRole("button", { name: names[index], exact: true }).click();
          }
          await expect.poll(() => page.locator(`#cr2-${ids[index]}`).evaluate(section => {
            const heading = section.querySelector(".cr2-section-heading, .cr2-iketeru-intro")!;
            const header = document.querySelector(".cr2-header")!;
            return Math.round(heading.getBoundingClientRect().top - header.getBoundingClientRect().bottom);
          })).toBe(28);
        }
      }
    }
  }
});

test("support changes fade text only while retaining the panel and accent", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(route);
  const chapter = page.locator('[data-chapter="learn"]');
  const panel = chapter.getByRole("tabpanel");
  await chapter.scrollIntoViewIfNeeded();
  const originalPanel = await panel.elementHandle();
  const originalAccent = await panel.locator(":scope > span").elementHandle();
  await chapter.getByRole("tab", { name: "サポーター制度", exact: true }).click();
  expect(await panel.evaluate((node, original) => node === original, originalPanel)).toBe(true);
  expect(await panel.locator(":scope > span").evaluate((node, original) => node === original, originalAccent)).toBe(true);
  await expect(panel).toHaveCSS("animation-name", "none");
  const copy = panel.locator(".cr2-support-detail-copy");
  await expect(copy).toHaveCSS("animation-name", "cr2-support-copy-fade");
  await expect(copy).toHaveCSS("animation-duration", "0.7s");
  await expect(copy).toHaveCSS("transform", "none");
  await expect(copy).toHaveCSS("opacity", "1");
  await expect(copy).toContainText("入社直後から立ち上がりまでの支援を行います。");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await chapter.getByRole("tab", { name: "メンター制度", exact: true }).click();
  await expect(copy).toHaveCSS("animation-name", "none");
  await expect(copy).toHaveCSS("opacity", "1");
});

test("career steps animate in order on entry and route changes, respecting reduced motion", async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(route);
    const shell = page.locator(".cr2-career-shell");
    await shell.scrollIntoViewIfNeeded();
    await expect(shell).toHaveAttribute("data-career-entered", "true");
    const tabs = shell.getByRole("tab");
    for (const index of [1, 0, 1]) {
      await tabs.nth(index).click();
      const panel = shell.getByRole("tabpanel");
      await expect(panel).toHaveCount(1);
      const motion = await panel.locator("li").evaluateAll(rows => rows.map(row => ({
        name: getComputedStyle(row.querySelector("strong")!).animationName,
        delay: parseFloat(getComputedStyle(row.querySelector("strong")!).animationDelay),
        line: getComputedStyle(row, "::before").animationName,
      })));
      expect(motion).toHaveLength(index === 1 ? 7 : 6);
      motion.forEach((value, step) => {
        expect(value.name).toBe("cr2-career-step-enter");
        expect(value.delay).toBeCloseTo(step * .09, 3);
        expect(value.line).toBe("cr2-career-line-enter");
      });
      await expect(panel.locator("li strong").last()).toHaveCSS("opacity", "1");
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await tabs.first().click();
    await expect(shell.locator("li strong").first()).toHaveCSS("animation-name", "none");
    await expect(shell.locator("li strong").first()).toHaveCSS("opacity", "1");
    await expect(tabs.first()).toBeFocused();
  }
});

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

test("responsive spacing is compact below 1100px and preserves desktop spacing", async ({ page }) => {
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator(".cr2-site")).toHaveAttribute("data-motion-ready", "reduced");
  for (const width of [320, 390, 600, 768, 820, 1024, 1099, 1100, 1200, 1440, 1512]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    const values = await page.evaluate(() => {
      const style = (selector: string) => getComputedStyle(document.querySelector(selector)!);
      const px = (value: string) => Number.parseFloat(value);
      return {
        definitionLead: px(style(".cr2-official-definition").marginTop),
        circleMargin: px(style(".cr2-official-static").marginTop),
        contentPadding: px(style(".cr2-official-definition-content").paddingTop),
        stackGap: px(style(".cr2-official-definition-wrap").gap),
        itemGap: px(style(".cr2-official-definition-content li").marginTop),
        sectionSpace: px(style(".cr2-career").paddingTop),
        heroMinimum: px(style(".cr2-adopted-hero").minHeight),
        inputMinimum: px(style('.cr2-form input[name="name"]').minHeight),
        tabMinimum: px(style(".cr2-support-item-list button").minHeight),
        entryHeadingMargin: px(style(".cr2-entry .cr2-section-heading").marginBottom),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(values.overflow, `${width}px overflow`).toBeLessThanOrEqual(0);
    expect(values.inputMinimum).toBe(52);
    expect(values.entryHeadingMargin).toBe(0);
    if (width < 1100) {
      expect(values.definitionLead).toBeGreaterThanOrEqual(56);
      expect(values.definitionLead).toBeLessThanOrEqual(88);
      expect(values.circleMargin).toBe(0);
      expect(values.contentPadding).toBe(0);
      expect(values.stackGap).toBeGreaterThanOrEqual(32);
      expect(values.stackGap).toBeLessThanOrEqual(44);
      expect(values.itemGap).toBeLessThanOrEqual(56);
      expect(values.sectionSpace).toBeLessThanOrEqual(80);
      expect(values.tabMinimum).toBeGreaterThanOrEqual(44);
    } else {
      expect(values.definitionLead).toBe(250);
      expect(values.circleMargin).toBe(150);
      expect(values.contentPadding).toBe(70);
      expect(values.stackGap).toBe(width < 1280 ? 32 : 58);
      expect(values.itemGap).toBe(80);
      expect(values.sectionSpace).toBe(width < 1200 ? 104 : 120);
      expect(values.heroMinimum).toBe(850);
    }
  }
});

test("mobile haze expansion never creates horizontal page scrolling", async ({ browser }) => {
  test.setTimeout(90_000);
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "no-preference",
  });
  try {
    const page = await context.newPage();
    for (const width of [320, 390, 820]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page.locator(".cr2-site")).toHaveAttribute("data-motion-ready", "enabled");
      const maxOverflow = await page.evaluate(async () => {
        const intro = document.querySelector(".cr2-iketeru > .cr2-container")!;
        scrollTo({ top: intro.getBoundingClientRect().top + scrollY - innerHeight * .34, behavior: "instant" });
        const until = performance.now() + 800;
        let overflow = 0;
        do {
          await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
          overflow = Math.max(overflow, document.documentElement.scrollWidth - document.documentElement.clientWidth);
        } while (performance.now() < until);
        return overflow;
      });
      await expect(page.locator(".cr2-official-blob")).toHaveCSS("opacity", "1");
      expect(maxOverflow, `${width}px animated haze overflow`).toBe(0);
      await page.evaluate(() => scrollBy({ left: 200, behavior: "instant" }));
      expect(await page.evaluate(() => scrollX)).toBe(0);
      // Clipping the decoration must not break the sticky header.
      expect(await page.locator(".cr2-header").evaluate(element => element.getBoundingClientRect().top)).toBe(0);
    }
  } finally {
    await context.close();
  }
});

test("responsive composition keeps readable copy and accessible compact controls", async ({ page }) => {
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390, 600, 768, 820, 1024, 1099]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator('.cr2-support-item-list').first()).toHaveAttribute('aria-orientation', width < 768 ? 'horizontal' : 'vertical');
    const values = await page.evaluate(() => {
      const elements = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector));
      const columns = (selector: string) => new Set(elements(selector).map(e => Math.round(e.getBoundingClientRect().x))).size;
      const box = document.querySelector<HTMLElement>('.cr2-official-definition-content li > p')!;
      const clipped = elements('.cr2-e-phrase, .cr2-career-tab-label, .cr2-support-item-list button, .cr2-footer-bottom nav a')
        .filter(e => e.clientWidth && getComputedStyle(e).visibility !== 'hidden' && e.scrollWidth > e.clientWidth + 1)
        .map(e => e.textContent);
      const entry = document.querySelector('.cr2-header .cr2-entry-button')!.getBoundingClientRect();
      // The hero deliberately hangs punctuation outside its half-width box;
      // check the actual text against the viewport rather than that optical box.
      const headingFits = elements('.cr2-e-line').every(e => {
        const range = document.createRange();
        range.selectNodeContents(e);
        const rect = range.getBoundingClientRect();
        return rect.left >= 0 && rect.right <= document.documentElement.clientWidth;
      });
      return {
        definitionColumns: columns('.cr2-official-definition-content li'),
        careerColumns: columns('.cr2-career-tabs button'),
        bodyFont: getComputedStyle(box).fontSize,
        bodyLine: Number.parseFloat(getComputedStyle(box).lineHeight),
        entry: { width: entry.width, height: entry.height },
        clipped,
        headingFits,
        pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(values.clipped, `${width}px clipped content`).toEqual([]);
    expect(values.headingFits, `${width}px hero text fits`).toBe(true);
    expect(values.pageOverflow).toBe(0);
    expect(values.bodyFont).toBe('16px');
    expect(values.bodyLine).toBeCloseTo(29.6, 1);
    expect(values.definitionColumns).toBe(width < 768 ? 1 : 2);
    expect(values.careerColumns).toBe(2);
    expect(values.entry.width).toBeGreaterThanOrEqual(44);
    expect(values.entry.height).toBeGreaterThanOrEqual(44);
  }
  await page.setViewportSize({width:390, height:844});
  const firstTab = page.getByRole('tab', {name:'プログラミング研修', exact:true});
  await firstTab.focus();
  await firstTab.press('ArrowRight');
  await expect(page.getByRole('tab',{name:'eラーニング',exact:true})).toBeFocused();
  await expect(page.locator('#cr2-support-detail-learn')).toContainText('プログラミングスキルを継続的に学ぶ環境を提供しています。');
  await page.locator('.cr2-header').getByRole('button',{name:'ENTRY',exact:true}).click();
  await expect.poll(() => page.locator('#cr2-entry > .cr2-container').evaluate(e => Math.round(e.getBoundingClientRect().top - document.querySelector('.cr2-header')!.getBoundingClientRect().bottom))).toBe(28);
  await page.getByRole('button',{name:'メニューを開く',exact:true}).click();
  await expect(page.locator('.cr2-entry-button')).toHaveAttribute('inert','');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:'メニューを開く',exact:true})).toBeFocused();
  await expect(page.locator('.cr2-entry-button')).not.toHaveAttribute('inert','');
});

test("full-viewport mobile opening and compact footer retain clear hierarchy and touch targets", async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 320, height: 390 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route);
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390, 600, 820, 1099]) {
    for (const height of [390, 568, 844, 1180]) {
      await page.setViewportSize({ width, height });
      await expect(page.locator('.cr2-header')).toHaveCSS('height', width < 768 ? '60px' : '64px');
      await expect(page.locator('.cr2-e-copy')).toHaveCSS('min-height', `${height - (width < 768 ? 60 : 64)}px`);
      const layout = await page.evaluate(() => {
        const rect = (s: string) => document.querySelector(s)!.getBoundingClientRect();
        const hero = rect('.cr2-adopted-hero');
        const toggle = document.querySelector('.cr2-motion-toggle')?.getBoundingClientRect();
        const footerLinks = [...document.querySelectorAll<HTMLElement>('.cr2-footer a')];
        return {
          heroHeight: hero.height,
          aboutTop: rect('#cr2-about').top + window.scrollY,
          buttonBottomGap: hero.bottom - rect('.cr2-e-bottom a').bottom,
          toggleTopGap: toggle ? toggle.top - rect('.cr2-e-bottom a').bottom : null,
          hintTopGap: rect('.cr2-e-hint').top - rect('.cr2-e-bottom a').bottom,
          openingGap: rect('.cr2-e-label').top - hero.top,
          headerHeight: rect('.cr2-header').height,
          menuInset: parseFloat(getComputedStyle(document.querySelector('.cr2-mobile-menu')!).top),
          menuRadius: getComputedStyle(document.querySelector('.cr2-menu-button')!).borderRadius,
          controlsFit: footerLinks.every(e => e.getBoundingClientRect().width >= 44 && e.getBoundingClientRect().height >= 44 && e.scrollWidth <= e.clientWidth + 1),
          footerOrder: ['.cr2-footer-top > a', '.cr2-footer-bottom nav', '.cr2-footer-top > div', '.cr2-footer-bottom > p'].map(s => rect(s).top),
          socialLabelsVisible: [...document.querySelectorAll('.cr2-footer-top > div .cr2-footer-label')].every(e => e.getBoundingClientRect().width > 0),
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      expect(layout.headerHeight).toBe(width < 768 ? 60 : 64);
      expect(layout.menuInset).toBe(layout.headerHeight);
      expect(layout.menuRadius).toBe('0px');
      expect(layout.openingGap).toBeGreaterThanOrEqual(23);
      // Balance spare space above/below the copy, reserving 56px more below
      // for the hint and pause control instead of a large empty bottom area.
      expect(layout.buttonBottomGap - layout.openingGap).toBeCloseTo(56, 0);
      expect(layout.controlsFit).toBe(true);
      expect(layout.socialLabelsVisible).toBe(true);
      expect(layout.footerOrder).toEqual([...layout.footerOrder].sort((a, b) => a - b));
      expect(layout.overflow).toBe(0);
      expect(layout.heroHeight).toBeGreaterThanOrEqual(height - layout.headerHeight - 1);
      expect(layout.aboutTop).toBeGreaterThanOrEqual(height - 1);
      expect(layout.buttonBottomGap).toBeGreaterThanOrEqual(79);
      if (layout.toggleTopGap !== null) expect(layout.toggleTopGap).toBeGreaterThanOrEqual(20);
      expect(layout.hintTopGap).toBeGreaterThanOrEqual(20);
      if (height >= 844) expect(layout.heroHeight + layout.headerHeight).toBeCloseTo(height, 0);
    }
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
      // Mobile uses the approved copy in a newly designed readable card layout.
      expect(values.exactHeight).toBeGreaterThan(2000);
      expect(values.exactHeight).toBeLessThan(2300);
      expect(values.wrap.x).toBeCloseTo(0, 0);
      expect(values.wrap.width).toBeCloseTo(390, 0);
      expect(values.circle.x).toBeCloseTo(55, 0);
      expect(values.circle.width).toBeCloseTo(280, 0);
      expect(values.content.x).toBeCloseTo(20, 0);
      expect(values.content.width).toBeCloseTo(350, 0);
      expect(values.headingSize).toBe("32px");
    }
  }
});

test("ABOUT copy finishes at its reading position without a timed catch-up", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator(".cr2-site")).toHaveAttribute("data-motion-ready", "enabled");
    const result = await page.evaluate(async () => {
      const container = document.querySelector<HTMLElement>(".cr2-iketeru > .cr2-container")!;
      const top = container.getBoundingClientRect().top + scrollY;
      const read = () => Array.from(container.querySelectorAll<HTMLElement>(".cr2-iketeru-intro, .cr2-iketeru-bridge"))
        .map(element => ({ opacity: Number(getComputedStyle(element).opacity), y: new DOMMatrixReadOnly(getComputedStyle(element).transform).m42 }));
      const settleScroll = async (y: number) => {
        scrollTo({ top: y, behavior: "instant" });
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      };
      // The supplied screenshot places the intro near the upper third.
      await settleScroll(top - innerHeight * .34);
      const finished = read();
      await settleScroll(0);
      return { finished, returned: read() };
    });
    for (const state of [...result.finished, ...result.returned]) {
      expect(state.opacity).toBe(1);
      expect(state.y).toBe(0);
    }
  }
});

test("#9 reproduces the official scroll motion and honors reduced motion", async ({ browser }) => {
  const animatedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  const animatedPage = await animatedContext.newPage();
  await animatedPage.goto(route, { waitUntil: "networkidle" });
  await expect(animatedPage.locator(".cr2-site")).toHaveAttribute("data-motion-ready", "enabled");

  const introTop = await animatedPage.locator(".cr2-iketeru > .cr2-container").evaluate(element => element.getBoundingClientRect().top + scrollY);
  await animatedPage.evaluate(top => scrollTo({ top: top - innerHeight * .34, behavior: "instant" }), introTop);
  // The haze must already appear at the user's ABOUT-intro screenshot position.
  await expect(animatedPage.locator(".cr2-official-blob")).toHaveCSS("opacity", "1");
  await expect.poll(() => animatedPage.locator(".cr2-official-blob").evaluate(element => Number.parseFloat(getComputedStyle(element).getPropertyValue("--cr2-blob-scale"))))
    .toBeCloseTo(1, 2);

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
    await expect(headingArrow).toHaveCSS("filter", "none");
    await expect(page.locator(".cr2-adopted-hero")).toHaveCSS("color", "rgb(13, 43, 43)");
    await expect(page.locator(".cr2-geometric-background")).toHaveCSS("background-color", "rgb(241, 241, 241)");
    await expect(page.locator(".cr2-geometric-background")).toHaveAttribute("data-palette", "official");
    const headingAngle = await headingArrow.evaluate((node) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
      return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    });
    expect(headingAngle).toBeCloseTo(-40, 1);
    const cta = page.locator(".cr2-e-bottom a");
    await expect(cta).toHaveAttribute("href", "https://incurise.co.jp/about/");
    await expect(cta).toHaveCSS("min-height", viewport.width === 1440 ? "64px" : "52px");
    // Wait for entrance transforms before measuring the optical text group.
    await expect(page.locator(".cr2-e-bottom")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
    const geometry = await page.evaluate(() => {
      const hero = document.querySelector(".cr2-adopted-hero")!.getBoundingClientRect();
      const label = document.querySelector(".cr2-e-label")!.getBoundingClientRect();
      const button = document.querySelector(".cr2-e-bottom a")!.getBoundingClientRect();
      return { x: label.x + label.width / 2 - (hero.x + hero.width / 2), y: (label.top + button.bottom) / 2 - (hero.top + hero.height / 2), height: hero.height, topGap: label.top - hero.top };
    });
    expect(Math.abs(geometry.x)).toBeLessThan(.5);
    if (viewport.width === 390) {
      // Fill the viewport with the copy optically centered above bottom controls.
      expect(geometry.height).toBeCloseTo(viewport.height - 60, 0);
      expect(geometry.y).toBeCloseTo(-28, 0);
    } else {
      expect(Math.abs(geometry.y)).toBeLessThan(.5);
    }
  }
});

test("adopted circles match the official opening's apparent particle size at 2x resolution", async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as typeof window & { particleShape: { circles: number; minRadius: number; maxRadius: number; nonCircles: number; squareGrains: number; bitmaps: number } };
    state.particleShape = { circles: 0, minRadius: Infinity, maxRadius: 0, nonCircles: 0, squareGrains: 0, bitmaps: 0 };
    const arc = CanvasRenderingContext2D.prototype.arc;
    CanvasRenderingContext2D.prototype.arc = function (x, y, radius, start, end, counterclockwise) {
      if (this.canvas.matches(".cr2-geometric-background canvas")) {
        const shape = state.particleShape;
        shape.circles++;
        shape.minRadius = Math.min(shape.minRadius, radius);
        shape.maxRadius = Math.max(shape.maxRadius, radius);
        if (Math.abs(end - start - Math.PI * 2) > .0001) shape.nonCircles++;
      }
      return arc.call(this, x, y, radius, start, end, counterclockwise);
    };
    const drawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (...args: Parameters<typeof drawImage>) {
      if (this.canvas.matches(".cr2-geometric-background canvas")) state.particleShape.bitmaps++;
      return drawImage.apply(this, args);
    };
    const fillRect = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
      if (this.canvas.matches(".cr2-geometric-background canvas") && width > 0 && width < 8 && height < 8) state.particleShape.squareGrains++;
      return fillRect.call(this, x, y, width, height);
    };
  });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    const shape = () => page.evaluate(() => (window as typeof window & { particleShape: { circles: number; minRadius: number; maxRadius: number; nonCircles: number; squareGrains: number; bitmaps: number } }).particleShape);
    await expect.poll(async () => (await shape()).circles).toBeGreaterThanOrEqual(width < 768 ? 13500 : 27000);
    const result = await shape();
    // Official shader size .75..2.25 (+2 on desktop), projected with FOV100/z300.
    // The soft reference circle's half-alpha edge is .35 of its quad diameter.
    const projection = 900 / (2 * Math.tan(50 * Math.PI / 180) * 300) * .35;
    const sizeOffset = width < 768 ? 0 : 2;
    expect(result.minRadius).toBeCloseTo((.75 + sizeOffset) * projection, 5);
    expect(result.maxRadius).toBeLessThanOrEqual((2.25 + sizeOffset) * projection);
    expect(result.maxRadius).toBeGreaterThan((2.24 + sizeOffset) * projection);
    expect(result.nonCircles).toBe(0);
    expect(result.squareGrains).toBe(0);
    expect(result.bitmaps).toBe(0);
    const resolution = await page.locator(".cr2-geometric-background canvas").evaluate(node => {
      const canvas = node as HTMLCanvasElement;
      return canvas.width / canvas.getBoundingClientRect().width;
    });
    expect(resolution).toBeCloseTo(2, 2);
  }
});

test("adopted particle motion pauses, resumes and respects reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(route, { waitUntil: "domcontentloaded" });
  const canvas = page.locator(".cr2-geometric-background canvas");
  const capture = () => canvas.evaluate(node => (node as HTMLCanvasElement).toDataURL());
  const initial = await capture();
  await expect.poll(capture).not.toBe(initial);
  await page.getByRole("button", { name: "背景アニメーションを一時停止" }).click();
  const resume = page.getByRole("button", { name: "背景アニメーションを再生" });
  await expect(resume).toHaveAttribute("aria-pressed", "true");
  const paused = await capture();
  await page.waitForTimeout(200);
  expect(await capture()).toBe(paused);
  await resume.click();
  await expect.poll(capture).not.toBe(paused);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".cr2-motion-toggle")).toHaveCount(0);
  const reduced = await capture();
  await page.waitForTimeout(200);
  expect(await capture()).toBe(reduced);
  const hasParticles = await canvas.evaluate(node => {
    const element = node as HTMLCanvasElement;
    const pixels = element.getContext("2d")!.getImageData(0, 0, element.width, element.height).data;
    return pixels.some((value, index) => index % 4 === 3 && value > 0);
  });
  expect(hasParticles).toBe(true);
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
  await expect.poll(() => page.locator("#cr2-support > .cr2-container").evaluate(el => Math.round(el.getBoundingClientRect().top - document.querySelector('.cr2-header')!.getBoundingClientRect().bottom))).toBe(28);
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
  await expect(shell.getByRole("tabpanel")).toContainText("Javaを中心に、入社後3カ月集中して学ぶ。");
  const footerLinks = await page.locator(".cr2-footer-bottom nav a").evaluateAll(nodes => nodes.map(el => ({y: Math.round(el.getBoundingClientRect().y), height:el.getBoundingClientRect().height})));
  expect(new Set(footerLinks.map(link => link.y)).size).toBe(3);
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


test("layout refresh during navigation does not interrupt smooth scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route);
  await expect(page.locator(".cr2-site")).toHaveAttribute("data-motion-ready", "enabled");
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".cr2-header").getByRole("button", { name: "ENTRY", exact: true }).click();
  // A late-loading asset or an expanding panel requests a layout refresh.
  await page.locator(".cr2-site").evaluate(site => new Promise<void>(resolve => {
    const onFrame = () => {
      if (window.scrollY < 10) { requestAnimationFrame(onFrame); return; }
      const extra = document.createElement("div");
      extra.style.height = "1px";
      site.append(extra);
      resolve();
    };
    requestAnimationFrame(onFrame);
  }));
  await expect.poll(() => page.locator("#cr2-entry > .cr2-container").evaluate(anchor => {
    const header = document.querySelector(".cr2-header")!;
    return Math.round(anchor.getBoundingClientRect().top - header.getBoundingClientRect().bottom);
  })).toBe(28);
});
