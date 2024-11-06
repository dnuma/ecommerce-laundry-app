import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: "./src/tests",
  timeout: 90 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,
  reporter: "html",
  use: {
    baseURL: process.env.URL,
    trace: "on-first-retry",
    actionTimeout: 20 * 1000, 
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1366, height: 768 },
      },
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1366, height: 768 },
      },
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1366, height: 768 },
      },
    },
  ],
});
