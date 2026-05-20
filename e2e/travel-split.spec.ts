import { expect, test, type Page } from '@playwright/test';

async function resetTravelSplitDb(page: Page) {
  await page.goto('/');
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('travel-split');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => resolve();
    });
  });
  await page.reload();
}

function isMobileProject(projectName: string) {
  return projectName.startsWith('mobile');
}

test('shell selection follows browser platform, not viewport', async ({ page }, testInfo) => {
  await resetTravelSplitDb(page);
  const expectsMobile = isMobileProject(testInfo.project.name);

  if (expectsMobile) {
    await expect(page.locator('[data-layout="mobile"]')).toBeVisible();
    await expect(page.locator('[data-layout="desktop"]')).toHaveCount(0);
    await expect(page.getByRole('tablist', { name: 'App sections' })).toBeVisible();
  } else {
    await expect(page.locator('[data-layout="desktop"]')).toBeVisible();
    await expect(page.locator('[data-layout="mobile"]')).toHaveCount(0);
    await expect(page.getByRole('tablist', { name: 'App sections' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Trip group' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Activities & costs' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Who pays whom' })).toBeVisible();
  }
});

test('mobile-platform phone flow persists and settles', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-phone', 'Full mobile flow runs on the mobile-phone scenario only.');
  await resetTravelSplitDb(page);
  const mobile = page.locator('[data-layout="mobile"]');
  await expect(mobile.getByText('Travel Split')).toBeVisible();

  await mobile.getByRole('tab', { name: 'People' }).click();
  await mobile.getByLabel('Add someone').fill('Alex');
  await mobile.getByRole('button', { name: 'Add to trip' }).click();
  await expect(mobile.getByText('Alex')).toBeVisible();
  await mobile.getByLabel('Add someone').fill('Mina');
  await mobile.getByRole('button', { name: 'Add to trip' }).click();
  await expect(mobile.getByText('Mina')).toBeVisible();

  await mobile.getByRole('tab', { name: 'Expenses' }).click();
  await mobile.getByLabel('Title').fill('Dinner');
  await mobile.getByLabel('Amount').fill('40');
  await mobile.getByLabel('Paid by').selectOption({ label: 'Alex' });
  await mobile.getByRole('button', { name: 'Save expense' }).click();
  await expect(mobile.getByText('Dinner')).toBeVisible();

  await mobile.getByRole('tab', { name: 'Settle' }).click();
  await expect(mobile.getByText('Mina').first()).toBeVisible();
  await expect(mobile.getByText('Alex').first()).toBeVisible();
  await expect(mobile.getByText('$20.00').first()).toBeVisible();

  await page.reload();
  const reloadedMobile = page.locator('[data-layout="mobile"]');
  await reloadedMobile.getByRole('tab', { name: 'Settle' }).click();
  await expect(reloadedMobile.getByText('Mina').first()).toBeVisible();
  await page.screenshot({ path: 'artifacts/runtime-validation.png', fullPage: true });
});

test('desktop-platform wide workspace flow shows all panels at once', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-wide', 'Full desktop flow runs on the desktop-wide scenario only.');
  await resetTravelSplitDb(page);
  const desktop = page.locator('[data-layout="desktop"]');
  await expect(desktop).toBeVisible();
  await expect(page.locator('[data-layout="mobile"]')).toHaveCount(0);

  await expect(desktop.getByRole('heading', { name: 'Travel Split' })).toBeVisible();
  await expect(desktop.getByText('One screen · No accounts · Stays on your device')).toBeVisible();
  await expect(desktop.getByRole('heading', { name: 'Trip group' })).toBeVisible();
  await expect(desktop.getByRole('heading', { name: 'Activities & costs' })).toBeVisible();
  await expect(desktop.getByRole('heading', { name: 'Who pays whom' })).toBeVisible();

  await desktop.getByLabel('Add someone').fill('Alex');
  await desktop.getByRole('button', { name: 'Add to trip' }).click();
  await desktop.getByLabel('Add someone').fill('Mina');
  await desktop.getByRole('button', { name: 'Add to trip' }).click();
  await desktop.getByLabel('Title').fill('Dinner');
  await desktop.getByLabel('Amount').fill('40');
  await desktop.getByLabel('Paid by').selectOption({ label: 'Alex' });
  await desktop.getByRole('button', { name: 'Save expense' }).click();

  await expect(desktop.getByText('Dinner')).toBeVisible();
  await expect(desktop.getByText('$20.00').first()).toBeVisible();
  await page.screenshot({ path: 'artifacts/desktop-workspace-validation.png', fullPage: true });
});
