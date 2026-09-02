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

test("#37 keeps the official heading while #9 restores the full Definition composition", async ({ page }) => {
  for (const viewport of [
    { width: 1512, height: 982 },
    { width: 1440, height: 900 },
    { width: 820, height: 1180 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(route, { waitUntil: "domcontentloaded" });

    const values = await page.locator("#cr2-about").evaluate((section) => {
      const intro = section.querySelector<HTMLElement>(".cr2-iketeru-intro")!;
      const label = intro.querySelector<HTMLElement>(".cr2-official-label")!;
      const labelText = label.querySelector<HTMLElement>("em")!;
      const mark = label.querySelector<HTMLElement>(".cr2-official-mark")!;
      const black = mark.querySelector<HTMLElement>("i")!;
      const red = mark.querySelector<HTMLElement>("b")!;
      const heading = intro.querySelector<HTMLElement>("h2")!;
      const who = Array.from(intro.querySelectorAll<HTMLElement>(".cr2-iketeru-who")).find((node) => getComputedStyle(node).display !== "none")!;
      const bodyLayout = section.querySelector<HTMLElement>(".cr2-iketeru-body")!;
      const left = bodyLayout.querySelector<HTMLElement>(".cr2-iketeru-left")!;
      const dna = left.querySelector<HTMLElement>(".cr2-dna-visual")!;
      const orbit = dna.querySelector<HTMLElement>(".cr2-dna-orbit")!;
      const definition = bodyLayout.querySelector<HTMLElement>(".cr2-definition")!;
      const definitionList = definition.querySelector<HTMLElement>(".cr2-definition-list")!;
      const definitionIntro = Array.from(left.querySelectorAll<HTMLElement>(".cr2-definition-intro")).find((node) => getComputedStyle(node).display !== "none")!;
      const definitionClosing = Array.from(definition.querySelectorAll<HTMLElement>(".cr2-definition-closing")).find((node) => getComputedStyle(node).display !== "none")!;
      const style = (node: Element) => getComputedStyle(node);
      const normalizedText = (node: Element) => node.textContent?.replace(/\s+/g, " ").trim();
      const containerRect = section.querySelector<HTMLElement>(".cr2-container")!.getBoundingClientRect();
      const leftRect = left.getBoundingClientRect();
      const dnaRect = dna.getBoundingClientRect();
      const definitionRect = definition.getBoundingClientRect();
      const firstDefinition = definitionList.querySelector<HTMLElement>("article")!;
      return {
        introTags: Array.from(intro.children, (node) => node.tagName),
        labelTags: Array.from(label.children, (node) => node.tagName),
        label: {
          size: style(labelText).fontSize,
          weight: style(labelText).fontWeight,
          fontStyle: style(labelText).fontStyle,
          lineHeight: style(labelText).lineHeight,
          letterSpacing: style(labelText).letterSpacing,
          marginBottom: style(label).marginBottom,
        },
        accent: {
          blackDisplay: style(black).display,
          redWidth: style(red).width,
          redHeight: style(red).height,
          redTransform: style(red).transform,
        },
        heading: {
          size: style(heading).fontSize,
          weight: style(heading).fontWeight,
          lineHeight: style(heading).lineHeight,
          letterSpacing: style(heading).letterSpacing,
          marginBottom: style(heading).marginBottom,
        },
        who: {
          text: normalizedText(who),
          size: style(who).fontSize,
          lineHeight: style(who).lineHeight,
          letterSpacing: style(who).letterSpacing,
        },
        section: {
          background: style(section).backgroundColor,
          backgroundImage: style(section).backgroundImage,
          paddingTop: style(section).paddingTop,
        },
        hazeCount: section.querySelectorAll(".cr2-haze").length,
        legacyGridCount: section.querySelectorAll(".cr2-iketeru-grid, .cr2-iketeru-grid-intro").length,
        compositionOrder:
          intro.nextElementSibling === bodyLayout
          && bodyLayout.firstElementChild === left
          && left.nextElementSibling === definition
          && left.children[0]?.tagName === "H3"
          && left.lastElementChild === dna,
        desktopLayout: {
          display: style(bodyLayout).display,
          columns: style(bodyLayout).gridTemplateColumns,
          gap: style(bodyLayout).columnGap,
          leftX: leftRect.left - containerRect.left,
          definitionX: definitionRect.left - containerRect.left,
          dnaX: dnaRect.left - containerRect.left,
          dnaWidth: dnaRect.width,
          dnaHeight: dnaRect.height,
        },
        dnaLabel: normalizedText(orbit.querySelector("p")!),
        dnaTitle: normalizedText(orbit.querySelector("strong")!),
        definitionLabel: normalizedText(definition.querySelector(".cr2-definition-label")!),
        definitionTitle: normalizedText(left.querySelector("h3")!),
        definitionTitleColor: style(left.querySelector("h3")!).color,
        definitionIntro: normalizedText(definitionIntro),
        definitionClosing: normalizedText(definitionClosing),
        definitionCount: definitionList.children.length,
        definitionNames: Array.from(definitionList.querySelectorAll("h4"), normalizedText),
        definitionNumbers: definitionList.querySelectorAll("article > span").length,
        definitionSubheads: definitionList.querySelectorAll(".cr2-definition-copy > strong").length,
        definitionRowHeight: firstDefinition.getBoundingClientRect().height,
      };
    });

    const isMacBook = viewport.width >= 1500;
    const isDesktop = viewport.width >= 1100;
    const isTablet = viewport.width >= 768 && !isDesktop;
    expect(values.introTags).toEqual(["DIV", "H2", "P", "P"]);
    expect(values.labelTags).toEqual(["EM", "SPAN"]);
    expect(values.label.weight).toBe("700");
    expect(values.label.fontStyle).toBe("italic");
    expect(values.accent.blackDisplay).toBe("none");
    expect(values.accent.redWidth).toBe("16px");
    expect(values.accent.redHeight).toBe("2px");
    expect(values.accent.redTransform).toContain("0.707107");
    expect(values.heading.weight).toBe("700");
    expect(["0px", "normal"]).toContain(values.heading.letterSpacing);
    expect(values.section.background).toBe("rgb(255, 255, 255)");
    expect(values.section.backgroundImage).toBe("none");
    expect(values.hazeCount).toBe(0);
    expect(values.legacyGridCount).toBe(0);
    expect(values.compositionOrder).toBe(true);
    expect(values.dnaLabel).toBe("( Incurise DNA )");
    expect(values.dnaTitle).toBe("“IKETERU”の探求");
    expect(values.definitionLabel).toBe("Definition 〜 IKETERUの定義 〜");
    expect(values.definitionTitle).toBe("技術力×人間力。IKETERU人材を育てる。");
    expect(values.definitionTitleColor).toBe("rgb(13, 43, 43)");
    expect(values.definitionCount).toBe(6);
    expect(values.definitionNames).toEqual(["自信", "誠実", "貪欲", "行動力", "柔軟性", "格好"]);
    expect(values.definitionNumbers).toBe(0);
    expect(values.definitionSubheads).toBe(0);
    if (isDesktop) {
      expect(values.who.text).toBe("インキュライズという社名には、「Incubate（育成・支援）」と「Rise（成長・向上）」の想いが込められています。課題をチャンスに変え、可能性を最大限に引き出す。その挑戦を、私たちが全力で支援します。");
      expect(values.definitionIntro).toBe("テクニカルスキルとヒューマンスキルを兼ね備え、現場に前向きな変化を生み出す人材を「IKETERU」と定義しています。");
      expect(values.definitionClosing).toBe("“IKETERU”を共通言語に、一人ひとりの成長をクライアントと事業の成功へつなげます。");
      expect(parseFloat(values.section.paddingTop)).toBeCloseTo(isMacBook ? 117.6 : 112, 1);
      expect(parseFloat(values.heading.size)).toBeCloseTo(isMacBook ? 54.6 : 52, 1);
      expect(values.desktopLayout.display).toBe("grid");
      expect(values.desktopLayout.columns).toBe(isMacBook ? "420px 798px" : "400px 760px");
      expect(values.desktopLayout.gap).toBe(isMacBook ? "84px" : "80px");
      expect(values.desktopLayout.leftX).toBeCloseTo(0, 1);
      expect(values.desktopLayout.definitionX).toBeCloseTo(isMacBook ? 504 : 480, 1);
      expect(values.desktopLayout.dnaX).toBeCloseTo(isMacBook ? -44.1 : -42, 1);
      expect(values.desktopLayout.dnaWidth).toBeCloseTo(isMacBook ? 525 : 500, 1);
      expect(values.desktopLayout.dnaHeight).toBeCloseTo(isMacBook ? 640.5 : 610, 1);
      expect(values.definitionRowHeight).toBeCloseTo(isMacBook ? 138.6 : 132, 1);
    } else {
      expect(values.desktopLayout.display).toBe("flex");
      if (isTablet) {
        expect(values.who.text).toContain("インキュライズという社名には");
      } else {
        expect(values.who.text).toBe("「Incubate（育成・支援）」と「Rise（成長・向上）」の想いを社名に込め、課題をチャンスに変える挑戦を全力で支援します。");
        expect(values.definitionIntro).toBe("テクニカルスキルとヒューマンスキルを兼ね備え、現場へ前向きな変化を生み出す人材を「IKETERU」と定義しています。");
        expect(values.definitionClosing).toBe("“IKETERU”を共通言語に、成長をクライアントと事業の成功へつなげます。");
        expect(parseFloat(values.section.paddingTop)).toBeCloseTo(74, 1);
        expect(parseFloat(values.heading.size)).toBeCloseTo(26, 1);
        expect(values.definitionRowHeight).toBeGreaterThanOrEqual(174);
        expect(values.definitionRowHeight).toBeLessThan(180);
      }
    }
  }
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
  await faq.getByRole("button", { name: "Q1.未経験でも応募することはできますか" }).click();
  await expect(faq.getByText("はい。インキュライズでは、まずSEとして経験を積み、そこからコンサルタントへとキャリアアップしていく道を用意しています", { exact: true })).toBeVisible();
  await expect(faq.getByText("入社後はJavaを中心とした3ヶ月間の研修に集中できる環境が整っており、業界未経験の方でも着実にステップを踏んでいただけます", { exact: true })).toBeVisible();

  await faq.getByRole("button", { name: "Q3.配属やプロジェクトはどのように決まりますか？" }).click();
  await expect(faq.getByText("営業担当が、希望に沿った案件情報を集めます", { exact: true })).toBeVisible();
  await expect(faq.getByText("クライアント企業との面談を経て、アサイン先が決まります", { exact: true })).toBeVisible();
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
