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

test("#37 uses the official centered ttl-01 structure and exact responsive type", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
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
      const body = intro.querySelector<HTMLElement>("p")!;
      const gridIntro = section.querySelector<HTMLElement>(".cr2-iketeru-grid-intro")!;
      const grid = section.querySelector<HTMLElement>(".cr2-iketeru-grid")!;
      const style = (node: Element) => getComputedStyle(node);
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
          blackWidth: style(black).width,
          blackHeight: style(black).height,
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
        body: {
          size: style(body).fontSize,
          lineHeight: style(body).lineHeight,
          letterSpacing: style(body).letterSpacing,
        },
        section: {
          background: style(section).backgroundColor,
          paddingTop: style(section).paddingTop,
        },
        gridIntroIsImmediatelyBeforeGrid: gridIntro.nextElementSibling === grid,
      };
    });

    const desktop = viewport.width === 1440;
    expect(values.introTags).toEqual(["DIV", "H2", "P"]);
    expect(values.labelTags).toEqual(["EM", "SPAN"]);
    expect(values.label).toEqual({
      size: desktop ? "20px" : "16px",
      weight: "300",
      fontStyle: "italic",
      lineHeight: desktop ? "23px" : "18.4px",
      letterSpacing: desktop ? "2px" : "1.6px",
      marginBottom: desktop ? "40px" : "20px",
    });
    expect(values.accent.blackWidth).toBe("1px");
    expect(values.accent.blackHeight).toBe("40px");
    expect(values.accent.redWidth).toBe("4px");
    expect(values.accent.redHeight).toBe("57px");
    expect(values.accent.redTransform).toContain("0.866025");
    expect(values.heading).toEqual({
      size: desktop ? "48px" : "22px",
      weight: "700",
      lineHeight: desktop ? "81.6px" : "37.4px",
      letterSpacing: desktop ? "5.76px" : "2.64px",
      marginBottom: "40px",
    });
    expect(values.body).toEqual({
      size: desktop ? "20px" : "14px",
      lineHeight: desktop ? "40px" : "28px",
      letterSpacing: desktop ? "1.4px" : "0.98px",
    });
    expect(values.section.background).toBe("rgb(241, 241, 241)");
    expect(values.section.paddingTop).toBe(desktop ? "315px" : "100px");
    expect(values.gridIntroIsImmediatelyBeforeGrid).toBe(true);
  }
});

test("career tabs show one exact route and support removes closed details", async ({ page }) => {
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
  const mentorText = "あなたのキャリア形成の後押し役として、役員が直接相談にのります。";
  await expect(support.getByText(mentorText, { exact: true })).toHaveCount(0);
  await support.getByRole("button", { name: /メンター制度/ }).click();
  await expect(support.getByText(mentorText, { exact: true })).toBeVisible();
  await support.getByRole("button", { name: /サポーター制度/ }).click();
  await expect(support.getByText(mentorText, { exact: true })).toHaveCount(0);
  await expect(support.getByText("全新入社員に1人、先輩社員がサポーターとしてアサインされます。", { exact: true })).toBeVisible();
  const qualificationButton = support.getByRole("button", { name: /資格取得補助制度/ });
  await qualificationButton.focus();
  await qualificationButton.press("Enter");
  await expect(support.getByText("資格試験に合格した際に、受験料とお祝い金が支給される制度です。", { exact: true })).toBeVisible();
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
