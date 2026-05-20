import { expect, test, type Page } from '@playwright/test';

const DESKTOP_LAYOUT_MIN_WIDTH = 980;

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

function expectsMobileLayout(page: Page) {
  return (page.viewportSize()?.width ?? DESKTOP_LAYOUT_MIN_WIDTH) < DESKTOP_LAYOUT_MIN_WIDTH;
}

test('shell selection follows viewport width', async ({ page }) => {
  await resetTravelSplitDb(page);
  const expectsMobile = expectsMobileLayout(page);

  if (expectsMobile) {
    const mobileShell = page.locator('[data-layout="mobile"]');
    await expect(mobileShell).toBeVisible();
    await expect(page.locator('[data-layout="desktop"]')).toHaveCount(0);
    await expect(page.getByRole('tablist', { name: 'App sections' })).toBeVisible();

    const shellBox = await mobileShell.boundingBox();
    expect(shellBox).not.toBeNull();
    expect(shellBox!.width).toBeLessThanOrEqual(720);

    const tabBarBox = await page.getByRole('tablist', { name: 'App sections' }).boundingBox();
    const activeSurfaceBox = await page.locator('[data-active-surface="true"]').boundingBox();
    expect(tabBarBox).not.toBeNull();
    expect(activeSurfaceBox).not.toBeNull();
    expect(tabBarBox!.x).toBeGreaterThanOrEqual(shellBox!.x - 1);
    expect(tabBarBox!.x + tabBarBox!.width).toBeLessThanOrEqual(shellBox!.x + shellBox!.width + 1);
    expect(activeSurfaceBox!.width).toBeLessThanOrEqual(96);
    expect(activeSurfaceBox!.height).toBeGreaterThanOrEqual(44);
  } else {
    await expect(page.locator('[data-layout="desktop"]')).toBeVisible();
    await expect(page.locator('[data-layout="mobile"]')).toHaveCount(0);
    await expect(page.getByRole('tablist', { name: 'App sections' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Trip group' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Activities & costs' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Who pays whom' })).toBeVisible();
  }
});

test('resizing a desktop browser switches between mobile and desktop shells', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-wide', 'Resize behavior is covered once in desktop-wide.');
  await resetTravelSplitDb(page);

  await expect(page.locator('[data-layout="desktop"]')).toBeVisible();
  await page.setViewportSize({ width: 461, height: 900 });
  await expect(page.locator('[data-layout="mobile"]')).toBeVisible();
  await expect(page.locator('[data-layout="desktop"]')).toHaveCount(0);

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator('[data-layout="desktop"]')).toBeVisible();
  await expect(page.locator('[data-layout="mobile"]')).toHaveCount(0);
});

test('mobile-width flow persists and settles', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-phone', 'Full mobile-width flow runs on the mobile-phone scenario only.');
  await resetTravelSplitDb(page);
  const mobile = page.locator('[data-layout="mobile"]');
  await expect(mobile.getByText('Travel Split')).toBeVisible();

  await mobile.getByRole('button', { name: 'New trip ready. Add people to get started.' }).click();
  await expect(mobile.getByRole('tab', { name: 'People' })).toHaveAttribute('aria-selected', 'true');
  await expect(mobile.getByLabel('Add someone')).toBeFocused();
  await mobile.getByLabel('Add someone').fill('Alex');
  await mobile.getByRole('button', { name: 'Add to trip' }).click();
  await expect(mobile.getByText('Alex')).toBeVisible();
  await expect(mobile.getByLabel('Add someone')).toBeFocused();
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

test('mobile empty-state CTAs route to prerequisite inputs', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-phone', 'CTA routing runs on the mobile-phone scenario only.');
  await resetTravelSplitDb(page);
  const mobile = page.locator('[data-layout="mobile"]');
  await expect(mobile).toBeVisible();

  await mobile.getByRole('button', { name: /Go to People/ }).click();
  await expect(mobile.getByRole('tab', { name: 'People' })).toHaveAttribute('aria-selected', 'true');
  await expect(mobile.getByLabel('Add someone')).toBeFocused();

  await mobile.getByLabel('Add someone').fill('Alex');
  await mobile.getByRole('button', { name: 'Add to trip' }).click();
  await expect(mobile.getByText('Alex')).toBeVisible();

  await mobile.getByRole('tab', { name: 'Settle' }).click();
  await mobile.getByRole('button', { name: /Record an expense/ }).click();
  await expect(mobile.getByRole('tab', { name: 'Expenses' })).toHaveAttribute('aria-selected', 'true');
  await expect(mobile.getByLabel('Title')).toBeFocused();
});

test('mobile empty-state CTA returns after deleting the last person', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-phone', 'CTA lifecycle regression runs on the mobile-phone scenario only.');
  await resetTravelSplitDb(page);
  const mobile = page.locator('[data-layout="mobile"]');
  await expect(mobile).toBeVisible();

  await mobile.getByRole('tab', { name: 'People' }).click();
  await mobile.getByLabel('Add someone').fill('Alex');
  await mobile.getByRole('button', { name: 'Add to trip' }).click();
  await mobile.getByRole('button', { name: 'Remove Alex' }).click();

  await mobile.getByRole('tab', { name: 'Expenses' }).click();
  await expect(mobile.getByRole('button', { name: /Go to People/ })).toBeVisible();
});

test('custom weighted split points missing amount back to amount field and then saves', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-phone', 'Custom split regression runs on the mobile-phone scenario only.');
  await resetTravelSplitDb(page);
  const mobile = page.locator('[data-layout="mobile"]');
  await expect(mobile).toBeVisible();

  await mobile.getByRole('tab', { name: 'People' }).click();
  for (const name of ['Iana', 'John', 'Jake']) {
    await mobile.getByLabel('Add someone').fill(name);
    await mobile.getByRole('button', { name: 'Add to trip' }).click();
    await expect(mobile.getByText(name).first()).toBeVisible();
  }

  await mobile.getByRole('tab', { name: 'Expenses' }).click();
  await mobile.getByLabel('Title').fill('Hotel');
  await mobile.getByLabel('Paid by').selectOption({ label: 'Jake' });
  await mobile.getByRole('button', { name: 'Customize split' }).click();
  await mobile.locator('input[type="number"]').nth(1).fill('0.5');
  await mobile.getByRole('button', { name: 'Save expense' }).click();

  const amountInput = mobile.getByLabel('Amount');
  await expect(mobile.getByText('Add an amount.')).toBeVisible();
  await expect(amountInput).toBeFocused();

  await amountInput.fill('300');
  const johnWeightInput = mobile.locator('input[type="number"]').nth(1);
  await johnWeightInput.fill('0');
  await mobile.getByRole('button', { name: 'Save expense' }).click();
  await expect(mobile.getByText('Each share weight must be more than zero.')).toBeVisible();
  await expect(johnWeightInput).toBeFocused();

  await johnWeightInput.fill('0.5');
  await mobile.getByRole('button', { name: 'Save expense' }).click();
  await expect(mobile.getByText('Hotel')).toBeVisible();
  await expect(mobile.getByText('weighted')).toBeVisible();

  await mobile.getByRole('tab', { name: 'Settle' }).click();
  await expect(mobile.getByText('Jake').first()).toBeVisible();
  await expect(mobile.getByText('$120.00').first()).toBeVisible();
});

test('desktop-width workspace flow shows all panels at once', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-wide', 'Full desktop-width flow runs on the desktop-wide scenario only.');
  await resetTravelSplitDb(page);
  const desktop = page.locator('[data-layout="desktop"]');
  await expect(desktop).toBeVisible();
  await expect(page.locator('[data-layout="mobile"]')).toHaveCount(0);

  await expect(desktop.getByRole('heading', { name: 'Travel Split' })).toBeVisible();
  await expect(desktop.getByText('One screen · No accounts · Stays on your device')).toBeVisible();
  await expect(desktop.getByRole('heading', { name: 'Trip group' })).toBeVisible();
  await expect(desktop.getByRole('heading', { name: 'Activities & costs' })).toBeVisible();
  await expect(desktop.getByRole('heading', { name: 'Who pays whom' })).toBeVisible();
  await expect(desktop.locator('.empty-state-action')).toHaveCount(0);

  await desktop.getByLabel('Add someone').fill('Alex');
  await desktop.getByRole('button', { name: 'Add to trip' }).click();
  await expect(desktop.getByText('Alex').first()).toBeVisible();
  await expect(desktop.getByLabel('Add someone')).toBeFocused();
  await desktop.getByLabel('Add someone').fill('Mina');
  await desktop.getByRole('button', { name: 'Add to trip' }).click();
  await expect(desktop.getByText('Mina').first()).toBeVisible();
  await desktop.getByLabel('Title').fill('Dinner');
  await desktop.getByLabel('Amount').fill('40');
  await desktop.getByLabel('Paid by').selectOption({ label: 'Alex' });
  await desktop.getByRole('button', { name: 'Save expense' }).click();

  await expect(desktop.getByText('Dinner')).toBeVisible();
  await expect(desktop.getByText('$20.00').first()).toBeVisible();
  await page.screenshot({ path: 'artifacts/desktop-workspace-validation.png', fullPage: true });
});
