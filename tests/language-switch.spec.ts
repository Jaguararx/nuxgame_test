import { expect, test, type BrowserContext, type Page } from "@playwright/test";

import { TestData } from "./data/test-data";
import { HomePage } from "./pages/home.page";
import { LoginPage } from "./pages/login.page";
import { PreferencesPage } from "./pages/preferences.page";

let context: BrowserContext;
let page: Page;

test.beforeAll(async ({ browser }) => {
  expect(TestData.username, TestData.usernameRequired).not.toBe("");
  expect(TestData.password, TestData.passwordRequired).not.toBe("");

  context = await browser.newContext();
  page = await context.newPage();

  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.signIn(TestData.username, TestData.password);
});

test.afterAll(async () => {
  await context?.close();
});

test("authorized user changes the interface language", async () => {
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
