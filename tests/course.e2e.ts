import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
// @ts-expect-error Playwright runs this test in Node, while the site build omits Node globals.
import { readdirSync } from 'node:fs';

const lessonSlugs = (readdirSync(new URL('../dist/lessons/', import.meta.url), { withFileTypes: true }) as {
  isDirectory(): boolean;
  name: string;
}[])
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

test('every lesson renders at 320px without page overflow or runtime errors', async ({ page }) => {
  test.setTimeout(300_000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  for (const slug of lessonSlugs) {
    const response = await page.goto(`lessons/${slug}/`, { waitUntil: 'domcontentloaded' });
    expect(response?.ok(), slug).toBe(true);
    await expect(page.locator('h1').first(), slug).toBeVisible();
    await page.evaluate(async () => {
      const step = Math.max(200, window.innerHeight * 0.75);
      for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
      }
    });
    await expect(page.locator('astro-island[ssr]'), `${slug} island hydration`).toHaveCount(0);
    const overflow = await page.evaluate(() => ({
      body: document.body.scrollWidth - document.body.clientWidth,
      page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    expect(overflow.body, `${slug} body overflow`).toBeLessThanOrEqual(1);
    expect(overflow.page, `${slug} page overflow`).toBeLessThanOrEqual(1);
  }

  expect(errors).toEqual([]);
});

test('prediction explanation stays locked until the learner plays', async ({ page }) => {
  await page.goto('lessons/case-security-games/');
  const play = page.locator('[data-section="play"]');
  await play.scrollIntoViewIfNeeded();
  await expect(play.locator('astro-island')).not.toHaveAttribute('ssr', '');
  await play.locator('.predict button').nth(1).click();

  const comparison = play.locator('.prediction-answer');
  const summary = comparison.locator('summary');
  await expect(summary).toHaveText('Play once to compare');
  await summary.click();
  await expect(comparison).not.toHaveAttribute('open', '');

  const coverage = page.getByLabel('Coverage of the high-value target');
  await coverage.focus();
  await coverage.press('ArrowRight');
  await expect(summary).toHaveText('Compare after playing');
  await summary.click();
  await expect(comparison).toHaveAttribute('open', '');
});

test('completed lesson and quiz answers survive reload', async ({ page }) => {
  await page.goto('lessons/what-is-a-game/');
  await page.locator('[data-section]').first().waitFor();

  for (const section of await page.locator('[data-section]').all()) {
    await section.scrollIntoViewIfNeeded();
  }

  for (const quiz of await page.locator('.quiz').all()) {
    await quiz.scrollIntoViewIfNeeded();
    for (const option of await quiz.locator('.opt').all()) {
      await option.click();
      if (await quiz.getAttribute('data-solved') === 'true') break;
    }
    await expect(quiz).toHaveAttribute('data-solved', 'true');
  }

  await expect(page.locator('#donePanel')).toBeVisible();
  await page.reload();
  await expect(page.locator('#donePanel')).toBeVisible();
  for (const quiz of await page.locator('.quiz').all()) {
    await expect(quiz).toHaveAttribute('data-solved', 'true');
  }
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gt.progress.v1') ?? '{}').xp)).toBe(30);
});

test('map and progress use the same learner sequence', async ({ page }) => {
  await page.goto('');
  const mapLinks = await page.locator('.node-row .lrow').evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).pathname),
  );
  await page.goto('progress/');
  const progressLinks = await page.locator('.prow').evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).pathname),
  );
  expect(progressLinks).toEqual(mapLinks);
});

for (const theme of ['light', 'dark'] as const) {
  test(`representative pages have no serious accessibility violations in ${theme} mode`, async ({ page }) => {
    await page.addInitScript((selectedTheme) => {
      localStorage.setItem('gt.progress.v1', JSON.stringify({
        version: 1,
        lessons: {},
        xp: 0,
        daysLearned: [],
        settings: { theme: selectedTheme },
      }));
    }, theme);

    for (const path of ['', 'progress/', 'lessons/case-security-games/']) {
      await page.goto(path);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const serious = results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical');
      expect(serious, `${theme}: ${path || 'course map'}`).toEqual([]);
    }
  });
}
