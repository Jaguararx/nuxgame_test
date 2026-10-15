export class TestData {
  static readonly username = process.env.WIKIPEDIA_USERNAME ?? "";
  static readonly password = process.env.WIKIPEDIA_PASSWORD ?? "";

  static readonly loginPath = "/w/index.php?title=Special:UserLogin";
  static readonly preferencesPath =
    "/wiki/Special:Preferences#mw-prefsection-personal";
  static readonly homePath = "/wiki/Main_Page";

  static readonly ukrainian = "uk";
  static readonly english = "en";

  static readonly headings = {
    uk: "Налаштування",
    en: "Preferences",
  } as const;

  static readonly homeLabels = {
    uk: "Політика конфіденційності",
    en: "Privacy policy",
  } as const;

  static readonly usernameRequired = "WIKIPEDIA_USERNAME is required";
  static readonly passwordRequired = "WIKIPEDIA_PASSWORD is required";
  static readonly languageControlMissing =
    "Preferences language control is missing";

  static targetLanguage(current: string | null): "uk" | "en" {
    return current === TestData.ukrainian ? TestData.english : TestData.ukrainian;
  }

  static headingFor(language: "uk" | "en"): string {
    return TestData.headings[language];
  }

  static homeLabelFor(language: "uk" | "en"): string {
    return TestData.homeLabels[language];
  }
}
