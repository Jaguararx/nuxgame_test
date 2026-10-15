# Implementation Plan: Wikipedia Interface Language Switch

**Branch**: `001-wiki-language-switch` | **Date**: 2026-10-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-wiki-language-switch/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

An authorized Wikipedia user changes the interface language under Preferences → User profile → Internationalization, and the interface is then shown in Ukrainian or English. The project is one Playwright TypeScript check against English Wikipedia, run in the official Playwright container. After the check exits, the container copies Playwright's HTML report into `playwright-report/` on the host. Credentials are `WIKIPEDIA_USERNAME` and `WIKIPEDIA_PASSWORD` from a gitignored `.env`. `README.md` states the test case, the run command, and the report path.

## Technical Context

**Language/Version**: TypeScript on Node, `@playwright/test` 1.64.1

**Primary Dependencies**: `@playwright/test` 1.64.1, Docker image `mcr.microsoft.com/playwright:v1.64.1-noble`, Compose v2

**Storage**: N/A. Credentials live only in the operator's `.env`. The report is files in `playwright-report/`.

**Testing**: Playwright, Chromium only, one spec

**Target Platform**: Docker container on the operator's machine (Windows host is supported via Compose). Report is read on the host.

**Project Type**: Automated browser check plus a project description

**Performance Goals**: One signed-in session completes inside a 90-second test timeout. No throughput target.

**Constraints**: No secrets in the shared project. Report copied to the host after a passed or failed check. Do not restore the previous language. Do not use `uselang` instead of saving the preference. Select only `uk` or `en`.

**Scale/Scope**: One account, one test, two languages, one container command

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Result |
| --- | --- |
| I. Spec tracks behavior | Pass. This plan does not change the spec's behavior. |
| II. Schema migrations | Pass. No tables or columns. |
| III. Queries load used columns | Pass. No database queries. |
| IV. TypeScript must pass lint | Pass with the exception below. `npm run lint` is `tsc --noEmit`. |
| V. Justified complexity | Pass. One test project. The container is required by the spec. |

### Post-design re-check

Phase 1 adds no database, no second application, and no new secret store. Gates I–V stand as above.

## Project Structure

### Documentation (this feature)

```text
specs/001-wiki-language-switch/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── operator-run.md
└── tasks.md              # /speckit-tasks, not created here
```

### Source Code (repository root)

```text
README.md
package.json
tsconfig.json
playwright.config.ts
Dockerfile
docker-compose.yml
entrypoint.sh
.env.example
.gitignore
tests/
└── language-switch.spec.ts
playwright-report/        # host output, gitignored, created by the run
```

**Structure Decision**: A single Playwright project at the repository root. There is no `src/` application. `README.md` is the project description required by the spec. `entrypoint.sh` runs the test, copies `/tmp/playwright-report` to the mounted host folder, and preserves the test exit code. Compose service name: `wiki-language`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --- | --- | --- |
| Constitution technical constraint says application code is TypeScript on Next.js with Drizzle | The requester asked for a Playwright test, a container run, and an HTML report. There is no product UI or database in this feature. | A Next.js app would be a second application that the spec does not ask for. |
| Lint command is `tsc --noEmit` instead of `next lint` | `next lint` requires a Next.js app that this feature does not have. | Adding Next.js only to host the linter fails Principle V. |

## Implementation notes

Details and rejected options are in [research.md](research.md).

- Sign in at English Wikipedia `Special:UserLogin`, then open `Special:Preferences#mw-prefsection-personal`.
- Read `html` `lang`. Target `uk` unless the current language is already `uk`, then target `en`.
- Set `#mw-input-wplanguage` and save. Pass only when `lang` and the preferences heading match the target (`Налаштування` or `Preferences`). A changed select with the old heading fails.
- `playwright.config.ts` uses the HTML reporter with `open: 'never'` and output under `/tmp/playwright-report` when the container sets that folder. Local default may stay `playwright-report` for a non-container debug run; the supported path is the container.
- `.env.example` lists the two variable names with empty values. `.gitignore` includes `.env`, `playwright-report/`, `test-results/`, and `node_modules/`.
- `README.md` includes the written test case, `docker compose run --rm wiki-language`, and `playwright-report/index.html`.
