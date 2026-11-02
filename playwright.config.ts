import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 60000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: process.env.CI ? 1 : 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL || "http://127.0.0.1:4173",
    viewport: { width: 1440, height: 900 },
    trace: {
      mode: "retain-on-failure",
      screenshots: false,
      snapshots: true,
      sources: true,
    },
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        launchOptions: {
          firefoxUserPrefs: {
            "webgl.force-enabled": true,
            "webgl.enable-webgl2": true,
          },
        },
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        // Match the 1x desktop displays of the other Linux software-rendered
        // projects. Local macOS keeps Safari's native 2x profile.
        deviceScaleFactor: process.env.CI ? 1 : 2,
      },
    },
  ],
  webServer: [
    ...(!process.env.BASE_URL
      ? [
          {
            command: "npm run preview -- --port 4173 --strictPort",
            url: "http://127.0.0.1:4173",
            reuseExistingServer: !process.env.CI,
          },
        ]
      : []),
    {
      command:
        "./node_modules/.bin/vite preview --config tests/fixtures/vite.config.ts --port 4300 --host 127.0.0.1 --strictPort",
      url: "http://127.0.0.1:4300/tests/fixtures/ds.html",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
