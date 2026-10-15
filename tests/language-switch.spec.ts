import { expect, test } from "@playwright/test";

const username = process.env.WIKIPEDIA_USERNAME ?? "";
const password = process.env.WIKIPEDIA_PASSWORD ?? "";

test("authorized user changes the interface language", async ({ page }) => {
  expect(username, "WIKIPEDIA_USERNAME is required").not.toBe("");
  expect(password, "WIKIPEDIA_PASSWORD is required").not.toBe("");

  await page.goto("/w/index.php?title=Special:UserLogin");
  await page.locator("#wpName1").fill(username);
  await page.locator("#wpPassword1").fill(password);
  await page.locator("#wpLoginAttempt").click();

  const loginError = page.locator(".mw-message-box-error, .errorbox");
  if ((await loginError.count()) > 0) {
    throw new Error(
      `Sign-in failed: ${(await loginError.first().innerText()).trim()}`,
    );
  }
  await expect(page.locator("#wpName1")).toHaveCount(0);

  await page.goto("/wiki/Special:Preferences#mw-prefsection-personal");
  const language = page.locator("#mw-input-wplanguage");
  await expect(language, "Preferences language control is missing").toBeVisible();

  const current = await page.locator("html").getAttribute("lang");
  const target = current === "uk" ? "en" : "uk";
  const heading = target === "uk" ? "Налаштування" : "Preferences";

  await language.selectOption(target);
  await page.locator("#prefcontrol").click();

  await expect(page.locator("html")).toHaveAttribute("lang", target);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
});
