import { expect, test } from '@playwright/test';

const longScript = Array.from({ length: 120 }, (_, index) => `Line ${index + 1} - Teleprompter line.`).join('\n');

test.describe('teleprompter core flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('autoscrolls script in viewport on play', async ({ page }) => {
    await page.locator('[data-testid="script-textarea"]').fill(longScript);

    await page.locator('[data-testid="speed-slider"]').evaluate((element) => {
      const input = element as HTMLInputElement;
      input.value = '260';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const viewport = page.locator('[data-testid="teleprompter-viewport"]');

    const beforeScrollTop = await viewport.evaluate((element) => (element as HTMLDivElement).scrollTop);

    await page.locator('[data-testid="play-pause-button"]').click();
    await page.waitForTimeout(1000);

    const afterScrollTop = await viewport.evaluate((element) => (element as HTMLDivElement).scrollTop);

    expect(afterScrollTop).toBeGreaterThan(beforeScrollTop + 20);

    await page.locator('[data-testid="play-pause-button"]').click();
    await expect(page.locator('[data-testid="play-pause-button"]')).toHaveText('Play');
  });

  test('autoscrolls upward when direction is set to up', async ({ page }) => {
    await page.locator('[data-testid="script-textarea"]').fill(longScript);
    await page.locator('[data-testid="direction-up"]').check();

    await page.locator('[data-testid="speed-slider"]').evaluate((element) => {
      const input = element as HTMLInputElement;
      input.value = '260';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const viewport = page.locator('[data-testid="teleprompter-viewport"]');
    await viewport.evaluate((element) => {
      const viewportElement = element as HTMLDivElement;
      viewportElement.scrollTop = viewportElement.scrollHeight;
    });

    const beforeScrollTop = await viewport.evaluate((element) => (element as HTMLDivElement).scrollTop);

    await page.locator('[data-testid="play-pause-button"]').click();
    await page.waitForTimeout(1000);

    const afterScrollTop = await viewport.evaluate((element) => (element as HTMLDivElement).scrollTop);

    expect(afterScrollTop).toBeLessThan(beforeScrollTop - 20);
  });

  test('persists script and settings after reload', async ({ page }) => {
    await page.locator('[data-testid="script-textarea"]').fill('Persisted script\nSecond line');
    await page.locator('[data-testid="mirror-horizontal-toggle"]').check();

    await page.locator('[data-testid="font-size-slider"]').evaluate((element) => {
      const input = element as HTMLInputElement;
      input.value = '60';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await page.reload();

    await expect(page.locator('[data-testid="teleprompter-content-layer"]')).toHaveCSS('transform', 'matrix(-1, 0, 0, 1, 0, 0)');

    await page.locator('[data-testid="toggle-controls-button"]').click();
    await expect(page.locator('[data-testid="script-textarea"]')).toHaveValue('Persisted script\nSecond line');
  });
});
