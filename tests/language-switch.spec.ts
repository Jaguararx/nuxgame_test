import { expect, test, type BrowserContext, type Page, type TestInfo } from "@playwright/test";

import { TestData } from "./data/test-data";
import { HomePage } from "./pages/home.page";
import { LoginPage } from "./pages/login.page";
import { PreferencesPage } from "./pages/preferences.page";

let context: BrowserContext | undefined;
let page: Page | undefined;

async function attachFailureScreenshot(testInfo: TestInfo): Promise<void> {
  if (page === undefined) {
    return;
  }
  try {
    await testInfo.attach("screenshot", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  } catch {
    // Keep the original failure when the page can no longer be captured.
  }
}

test.beforeAll(async ({ browser }, testInfo) => {
  try {
    expect(TestData.username, TestData.usernameRequired).not.toBe("");
    expect(TestData.password, TestData.passwordRequired).not.toBe("");

    context = await browser.newContext();
    page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.signIn(TestData.username, TestData.password);
  } catch (error) {
    await attachFailureScreenshot(testInfo);
    throw error;
  }
});

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await attachFailureScreenshot(testInfo);
  }
});

test.afterAll(async () => {
  await context?.close();
});

test("authorized user changes the interface language", async () => {
  if (page === undefined) {
    throw new Error("Signed-in page is missing");
  }

  const preferencesPage = new PreferencesPage(page);
  await preferencesPage.open();
  await preferencesPage.expectLanguageControl();

  const target = TestData.targetLanguage(await preferencesPage.currentLanguage());
  await preferencesPage.selectLanguage(target);
  await preferencesPage.save();
  await preferencesPage.expectInterface(target);

  const homePage = new HomePage(page);
  await homePage.open();
  await homePage.expectInterface(target);
});
