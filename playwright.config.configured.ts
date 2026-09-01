import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests-configured",
  timeout: 60_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["line"]],
  use: {
    baseURL: "http://127.0.0.1:4175/incurise-recruit-site/",
    channel: "chrome",
    locale: "ja-JP",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4175",
    url: "http://127.0.0.1:4175/incurise-recruit-site/",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
