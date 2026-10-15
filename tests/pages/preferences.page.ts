import { expect, type Page } from "@playwright/test";

import { TestData } from "../data/test-data";

const languageOptionLabels = {
  uk: "uk · українська",
  en: "en · English",
} as const;

export class PreferencesPage {
  constructor(private readonly page: Page) {}

  private get globalPreferencesLink() {
    return this.page.locator("#mw-input-wpglobal-info a");
  }

  private get globalLanguageCheckbox() {
    return this.page.locator("#mw-input-wplanguage-global input");
  }

  private get languageField() {
    return this.page.locator(".mw-htmlform-field-HTMLSelectLanguageField");
  }

  private get languageSelect() {
    return this.page.locator("#mw-input-wplanguage");
  }

  private get languageCombobox() {
    return this.languageField.locator('input[role="combobox"]');
  }

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
    await this.globalPreferencesLink.click();
    await this.page.waitForURL(/Special:GlobalPreferences/);
  }

  async expectLanguageControl(): Promise<void> {
    await expect(
      this.globalLanguageCheckbox,
      TestData.languageControlMissing,
    ).toBeVisible();
    await expect(this.languageCombobox, TestData.languageControlMissing).toBeVisible();
  }

  async currentLanguage(): Promise<string | null> {
    return this.documentElement.getAttribute("lang");
  }

  async selectLanguage(language: "uk" | "en"): Promise<void> {
    if (!(await this.globalLanguageCheckbox.isChecked())) {
      await this.globalLanguageCheckbox.check();
    }
    await expect(this.languageCombobox).toBeEnabled();
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
    await this.page.goto(TestData.preferencesPath);
    await expect(this.documentElement).toHaveAttribute("lang", language);
    await expect(this.heading).toHaveText(TestData.headingFor(language));
  }
}
