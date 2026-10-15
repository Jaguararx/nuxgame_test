# Research: Wikipedia Interface Language Switch

## Decision: Playwright 1.64.1 in TypeScript

**Rationale**: The requester required a TypeScript or JavaScript Playwright test. 1.64.1 is the current stable release (14 October 2026). One browser project (Chromium) is enough to prove the preferences flow.

**Alternatives considered**: A hand-written browser script (no HTML report out of the box). Playwright's other browsers (extra time, same preferences page).

## Decision: Official Playwright image, tag matched to 1.64.1

**Rationale**: `mcr.microsoft.com/playwright:v1.64.1-noble` already contains the browser binaries and system libraries that match `@playwright/test` 1.64.1. The image tag and the npm package MUST stay on the same version. Implementation MUST confirm the tag exists before the Dockerfile is committed; if Noble is unpublished for this patch, use the Ubuntu tag Microsoft published for 1.64.1.

**Alternatives considered**: A plain Node image plus `playwright install --with-deps` (slower builds, easier to mismatch browsers and the npm package).

## Decision: Copy the HTML report to a host folder after the run

**Rationale**: Playwright's built-in HTML reporter writes `playwright-report/index.html` and replaces that folder on each run. Inside a container those files disappear when the container stops, and the reporter deletes its output folder before writing. Deleting a bind-mounted directory is unreliable. The reporter therefore writes to `/tmp/playwright-report` with `open: 'never'`. The container entrypoint then copies that folder to `/report`, which is the host directory `playwright-report/`, and exits with the test's status code. The copy runs after a passed or failed test. `ipc: host` is set so Chromium is not starved of shared memory.

**Alternatives considered**: Bind-mounting the reporter folder directly (host files can be left root-owned, and the reporter may fail while replacing the mount). `docker cp` as a manual follow-up step (easy to skip, so a failed run can leave no host report).

## Decision: Credentials are process environment variables

**Rationale**: `WIKIPEDIA_USERNAME` and `WIKIPEDIA_PASSWORD` come from a local `.env` file passed with Compose `env_file`. The test reads only `process.env`. `.env` is gitignored. `.env.example` is committed with empty values and no real account. The project description names the variables but never their values.

**Alternatives considered**: A secrets manager (out of scope for one local run). Hard-coded credentials (forbidden by the spec).

## Decision: English Wikipedia preferences, saved language, not `uselang`

**Rationale**: The application under test is `https://en.wikipedia.org`. Interface language is the user preference under Preferences → User profile → Internationalisation (MediaWiki's English label uses the British spelling). The visible control is the language dropdown in `.mw-htmlform-field-HTMLSelectLanguageField` (`input[role="combobox"]`). The native `#mw-input-wplanguage` select stays in the form but is hidden, so a visibility check on that select fails. Option values are `uk` (shown as `uk · українська`) and `en` (shown as `en · English`). After the dropdown changes, the check presses the Save button in the sticky bar at the bottom of the preferences form (`#mw-prefs-form .mw-htmlform-submit-buttons button[type="submit"]`) and waits for the page to reload. A `uselang` query parameter would change the view without saving the preference, so it MUST NOT be used as the action under test.

**Alternatives considered**: The Universal Language Selector dialog (extra UI, not the preferences select the scenario names). Another language edition of Wikipedia (out of scope).

## Decision: What proves the interface changed

**Rationale**: The current language is `document.documentElement.lang`. If it is `uk`, the target is English (`en`); otherwise the target is Ukrainian (`uk`), including when the account is already in some third language. After save, the check passes only when both are true: `html` `lang` equals the target code, and the preferences page heading is the target language's word for that page (`Preferences` in English, `Налаштування` in Ukrainian). The submitted value in the hidden `#mw-input-wplanguage` select may be checked as well, but a matching value with the old heading MUST fail.

**Alternatives considered**: Asserting only the select (rejected by the spec). Asserting article text (article language is out of scope and usually does not change).

## Decision: Sign-in before Preferences

**Rationale**: Open `Special:UserLogin`, fill the username and password fields, and submit. Then open `Special:Preferences#mw-prefsection-personal`. The supplied account is assumed to accept a password with no second verification step. Wrong or empty credentials fail the test; Playwright still writes the HTML report, and the entrypoint still copies it.

**Alternatives considered**: A stored storage state checked into the repo (it would be a credential-like secret).

## Decision: No Next.js application and no database

**Rationale**: The spec is a single automated check plus a container run and a project description. A web app, Drizzle, and SQL migrations would not help prove the Wikipedia preference. See the constitution exception in `plan.md`.

**Alternatives considered**: Wrapping the test in the constitution's Next.js layout (rejected: extra application boundary with no user-facing product).

## Decision: Typecheck is the lint gate

**Rationale**: There is no Next.js app, so `next lint` cannot run. `npm run lint` runs `tsc --noEmit` on the test project and MUST pass before the work is finished.

**Alternatives considered**: Adding ESLint with no rules that the spec requires (extra setup, same type-safety outcome).

## Decision: One test timeout of 90 seconds

**Rationale**: The spec sets no product time limit. A 90-second test timeout and a 30-second navigation timeout stop a hung Wikipedia page from leaving the container running. This is an operational bound, not a success metric.

**Alternatives considered**: The Playwright default of 30 seconds for the whole test (too tight for login plus a preferences save on a public wiki).
