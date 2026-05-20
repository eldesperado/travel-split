import { defineConfig, devices } from '@playwright/test';

const pixel = devices['Pixel 7'];

export default defineConfig({
  testDir: './e2e',
  outputDir: './artifacts/playwright',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop-wide',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'desktop-narrow',
      use: { ...devices['Desktop Chrome'], viewport: { width: 430, height: 932 } },
    },
    {
      name: 'mobile-phone',
      use: { ...pixel, viewport: { width: 390, height: 844 } },
    },
    {
      name: 'mobile-wide',
      use: { ...pixel, viewport: { width: 1280, height: 900 } },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
