import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.e2e.ts',
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  use: {
    baseURL: 'http://127.0.0.1:4331/game-theory-lessons/',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'ASTRO_PREVIEW_BACKGROUND=0 npm run preview -- --host 127.0.0.1 --port 4331 --ignore-lock',
    url: 'http://127.0.0.1:4331/game-theory-lessons/',
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 800 } },
    },
  ],
});
