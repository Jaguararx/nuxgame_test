import { expect, type Page } from "@playwright/test";

import { TestData } from "../data/test-data";

export class LoginPage {
  constructor(private readonly page: Page) {}

  private get usernameInput() {
    return this.page.locator("#wpName1");
  }

  private get passwordInput() {
    return this.page.locator("#wpPassword1");
  }

  private get submitButton() {
    return this.page.locator("#wpLoginAttempt");
  }

  private get error() {
    return this.page.locator(".mw-message-box-error, .errorbox");
  }

  async open(): Promise<void> {
    await this.page.goto(TestData.loginPath);
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();

    if ((await this.error.count()) > 0) {
      throw new Error(`Sign-in failed: ${(await this.error.first().innerText()).trim()}`);
    }
    await expect(this.usernameInput).toHaveCount(0);
  }
}
