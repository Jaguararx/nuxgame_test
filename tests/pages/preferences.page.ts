import { expect, type Page } from "@playwright/test";

import { TestData } from "../data/test-data";

export class PreferencesPage {
  constructor(private readonly page: Page) {}

  private get languageSelect() {
    return this.page.locator("#mw-input-wplanguage");
  }

  private get saveButton() {
    return this.page.locator("#prefcontrol");
  }

  private get documentElement() {
    return this.page.locator("html");
  }

  private get heading() {
    return this.page.getByRole("heading", { level: 1 });
  }

  async open(): Promise<void> {
    await this.page.goto(TestData.preferencesPath);
  }

  async expectLanguageControl(): Promise<void> {
    await expect(this.languageSelect, TestData.languageControlMissing).toBeVisible();
  }

  async currentLanguage(): Promise<string | null> {
    return this.documentElement.getAttribute("lang");
  }

  async selectLanguage(language: "uk" | "en"): Promise<void> {
    await this.languageSelect.selectOption(language);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async expectInterface(language: "uk" | "en"): Promise<void> {
    await expect(this.documentElement).toHaveAttribute("lang", language);
    await expect(this.heading).toHaveText(TestData.headingFor(language));
  }
}
