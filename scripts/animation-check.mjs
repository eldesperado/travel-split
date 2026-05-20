import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
await page.goto('http://127.0.0.1:4173');
await page.evaluate(async () => {
  await indexedDB.deleteDatabase('travel-split');
});
await page.reload();
await page.getByRole('tab', { name: 'People' }).click();
await page.getByLabel('Add someone').fill('Alex');
await page.getByRole('button', { name: 'Add to trip' }).click();
await page.waitForTimeout(70);
await page.screenshot({ path: 'artifacts/animation-add-person-midflight.png', fullPage: true });
const addState = await page.locator('.motion-row').first().evaluate((el) => ({
  className: el.className,
  animationName: getComputedStyle(el).animationName,
  animationDuration: getComputedStyle(el).animationDuration,
  transform: getComputedStyle(el).transform,
  opacity: getComputedStyle(el).opacity,
}));
await page.waitForTimeout(250);
await page.getByLabel('Remove Alex').click();
await page.waitForTimeout(60);
await page.screenshot({ path: 'artifacts/animation-remove-person-midflight.png', fullPage: true });
const removeRows = await page.locator('.motion-row').evaluateAll((rows) => rows.map((el) => ({
  className: el.className,
  animationName: getComputedStyle(el).animationName,
  animationDuration: getComputedStyle(el).animationDuration,
  transform: getComputedStyle(el).transform,
  opacity: getComputedStyle(el).opacity,
})));
console.log(JSON.stringify({ addState, removeRows }, null, 2));
await browser.close();
