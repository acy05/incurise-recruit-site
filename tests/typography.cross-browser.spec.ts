import { expect, test } from '@playwright/test';

for (const width of [320, 390, 402, 430, 768, 1024, 1440]) {
  test(`definition copy uses natural line width at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('comment-revision/');
    await page.evaluate(() => document.fonts.ready);
    const paragraphs = page.locator('.cr2-official-definition-content li > p');
    await expect(paragraphs).toHaveCount(12);
    const metrics = await paragraphs.evaluateAll(elements => elements.map(element => {
      const style = getComputedStyle(element);
      const range = document.createRange();
      range.selectNodeContents(element);
      const lines = Array.from(range.getClientRects());
      return {
        alignment: style.textAlign,
        spacing: style.letterSpacing,
        wrapping: style.getPropertyValue('text-wrap-style'),
        // Ordinary Japanese wrapping may reserve space for punctuation, but
        // should not leave the wide blank strip caused by pretty wrapping.
        gaps: lines.slice(0, -1).map(line => element.getBoundingClientRect().right - line.right),
      };
    }));
    if (width < 1100) {
      for (const metric of metrics) {
        expect(metric.alignment).toBe('left');
        expect(['normal', '0px']).toContain(metric.spacing);
        expect(metric.wrapping).toBe('auto');
        for (const gap of metric.gaps) expect(gap).toBeLessThan(34);
      }
    } else {
      expect(metrics.every(metric => metric.alignment !== 'justify')).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  });
}
