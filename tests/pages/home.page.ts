import { expect, type Page } from "@playwright/test";

import { TestData } from "../data/test-data";

export class HomePage {
  constructor(private readonly page: Page) {}

  private get documentElement() {
    return this.page.locator("html");
  }

  private get privacyLink() {
    return this.page.locator("#footer-places-privacy a");
  }

  async open(): Promise<void> {
    await this.page.goto(TestData.homePath);
  }

  async expectInterface(language: "uk" | "en"): Promise<void> {
    await expect(this.documentElement).toHaveAttribute("lang", language);
    await expect(this.privacyLink).toHaveText(TestData.homeLabelFor(language));
  }
}
