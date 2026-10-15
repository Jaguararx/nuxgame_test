# Data Model: Wikipedia Interface Language Switch

No database. These are the objects the check reads and writes.

## Authorized user

An existing English Wikipedia account supplied by the operator.

| Field | Rule |
| --- | --- |
| Username | Required. `WIKIPEDIA_USERNAME`. Non-empty. Not stored in the shared project. |
| Password | Required. `WIKIPEDIA_PASSWORD`. Non-empty. Not stored in the shared project. |
| Second factor | Must not be required. The check has no step for it. |

The project does not create, delete, or rename the account.

## Interface language

The display language of the Wikipedia chrome for that account.

| Field | Rule |
| --- | --- |
| Code | Read from the page `lang` attribute. |
| Current | Whatever the account has when the check opens Preferences. |
| Target | `uk` when current is not `uk`. `en` when current is `uk`. |
| Heading | `Налаштування` when the target is `uk`. `Preferences` when the target is `en`. |

Allowed stored values after a successful run: `uk` or `en` only. The check does not restore the previous language.

### State

1. **Unknown** — preferences not open yet.
2. **Current read** — `lang` is known, target is chosen.
3. **Saved** — the preferences form was submitted.
4. **Shown** — `lang` and the preferences heading match the target. This is the only passing end state.
5. **Unchanged** — save finished but `lang` or the heading still matches the previous language. Failing end state.

## Test case

The written case in the project description and the automated check. Both use the same precondition, path, action, and expected result.

| Field | Value |
| --- | --- |
| Precondition | Authorized user, credentials only in the local environment file. |
| Path | Preferences → User profile → Internationalization. |
| Action | Select the target language and save. |
| Expected result | The interface is shown in that language. |

## Test report

One HTML report for the container run that just finished.

| Field | Rule |
| --- | --- |
| Location | `playwright-report/index.html` on the host. |
| Produced when | The Playwright process ran, whether the check passed or failed. |
| Not produced when | The container never started the check. |
| Replacement | Each new run replaces the previous host report. |

## Relationships

- One authorized user has one current interface language.
- One run reads that language, chooses one target, and writes one test report.
- The test case describes that run. It does not store credentials.
