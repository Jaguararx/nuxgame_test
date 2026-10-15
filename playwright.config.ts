import { defineConfig, devices } from "@playwright/test";

const reportDir = process.env.PLAYWRIGHT_HTML_REPORT_DIR ?? "playwright-report";

export default defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  use: {
    baseURL: "https://en.wikipedia.org",
    navigationTimeout: 30_000,
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: [["html", { open: "never", outputFolder: reportDir }]],
});
