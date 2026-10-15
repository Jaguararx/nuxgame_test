import { expect, type Page } from "@playwright/test";

import { TestData } from "../data/test-data";

const languageOptionLabels = {
  uk: "uk · українська",
  en: "en · English",
} as const;

export class PreferencesPage {
  constructor(private readonly page: Page) {}

  private get languageField() {
    return this.page.locator(".mw-htmlform-field-HTMLSelectLanguageField");
  }

  /** Native select is kept for the submitted value. The page hides it. */
  private get languageSelect() {
    return this.page.locator("#mw-input-wplanguage");
  }

  private get languageCombobox() {
    return this.languageField.locator('input[role="combobox"]');
  }

  /** Sticky bar pinned to the bottom of the preferences form. */
  private get saveButton() {
    return this.page.locator(
      "#mw-prefs-form .mw-htmlform-submit-buttons button[type='submit']",
    );
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
    await expect(this.languageCombobox, TestData.languageControlMissing).toBeVisible();
  }

  async currentLanguage(): Promise<string | null> {
    return this.documentElement.getAttribute("lang");
  }

  async selectLanguage(language: "uk" | "en"): Promise<void> {
    await this.languageCombobox.click();
    await this.languageField
      .getByRole("option", { name: languageOptionLabels[language], exact: true })
      .click();
    await expect(this.languageSelect).toHaveValue(language);
  }

  async save(): Promise<void> {
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.click();
  }

  async expectInterface(language: "uk" | "en"): Promise<void> {
    await expect(this.documentElement).toHaveAttribute("lang", language);
    await expect(this.heading).toHaveText(TestData.headingFor(language));
  }
}
