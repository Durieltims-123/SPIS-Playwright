import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers:4,
  // workers: process.env.CI ? 1 : undefined,
  reporter: [['junit', { outputFile: 'test-results/results.xml' }]],
  // use: {
  //   browserName: 'chromium',
  //   channel: 'chrome', // Use Google Chrome
  //   headless: false,
  //   baseURL: 'http://172.31.208.231/spis-testing',
  //   trace: 'on-first-retry',
  //   // storageState: 'storageState.json',
  // },


  use: {
    browserName: 'chromium',
    channel: 'chrome', // Use Google Chrome
    headless: true,
    storageState: 'storageState.json', // Stores session & cookies
  },

  projects: [
    {
      name: 'Google Chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        headless: false,
      },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // globalSetup: require.resolve('./global-setup'),
});
