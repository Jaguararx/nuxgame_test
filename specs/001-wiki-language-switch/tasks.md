---
description: "Task list for the Wikipedia interface language switch check"
---

# Tasks: Wikipedia Interface Language Switch

**Input**: Design documents from `/specs/001-wiki-language-switch/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The automated check is the product for User Story 1, not a separate TDD layer. No extra test tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Repository root, single Playwright project:

- `tests/language-switch.spec.ts`
- `playwright.config.ts`
- `Dockerfile`, `docker-compose.yml`, `entrypoint.sh`
- `README.md`, `.env.example`, `.gitignore`
- Host report: `playwright-report/index.html`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create `package.json` and `package-lock.json` with `@playwright/test` pinned to 1.64.1, script `test` running `playwright test`, and script `lint` running `tsc --noEmit`
- [X] T002 [P] Create `tsconfig.json` with strict TypeScript that includes `playwright.config.ts` and `tests/**/*.ts`
- [X] T003 [P] Create `.gitignore` ignoring `.env`, `node_modules/`, `playwright-report/`, and `test-results/`
- [X] T004 [P] Create `.env.example` with empty `WIKIPEDIA_USERNAME=` and `WIKIPEDIA_PASSWORD=` and no account values

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared Playwright configuration required before any user story

**Critical**: No user story work can begin until this phase is complete

- [X] T005 Create `playwright.config.ts` for Chromium only, `baseURL` `https://en.wikipedia.org`, test timeout 90000, navigation timeout 30000, HTML reporter with `open: 'never'`, and `outputFolder` from `PLAYWRIGHT_HTML_REPORT_DIR` defaulting to `playwright-report`

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Authorized user changes the interface language (Priority: P1)

**Goal**: A signed-in Wikipedia user changes the interface language and the interface is shown in that language

**Independent Test**: With `WIKIPEDIA_USERNAME` and `WIKIPEDIA_PASSWORD` set in the environment, `npx playwright test` signs in, saves the target language, and passes only when the interface heading matches that language

### Implementation for User Story 1

- [X] T006 [US1] Implement `tests/language-switch.spec.ts` so it reads credentials only from `process.env`, fails when `WIKIPEDIA_USERNAME` or `WIKIPEDIA_PASSWORD` is missing or empty, signs in at `Special:UserLogin` with no second-factor step, opens `Special:Preferences#mw-prefsection-personal`, reads the current language from the page `lang` attribute, selects `uk` when current is not `uk` and `en` when current is `uk` via `#mw-input-wplanguage`, saves the preference, and passes only when `lang` and the preferences heading match the target (`Налаштування` for `uk`, `Preferences` for `en`). A matching select with the previous heading fails. A wrong password, a failed sign-in, or a missing preferences language control fails the check and does not pass. Do not assert the visible section title. Do not restore the previous language. Do not use `uselang`.
- [X] T007 [US1] Run `npm run lint` and fix `tests/language-switch.spec.ts` and `playwright.config.ts` until `tsc --noEmit` passes

**Checkpoint**: User Story 1 is testable with `npx playwright test` before the container exists

---

## Phase 4: User Story 2 - Operator runs the check and reads the report on the host (Priority: P2)

**Goal**: One container command runs the check and leaves Playwright's HTML report on the host

**Independent Test**: `docker compose run --rm wiki-language` finishes with no further input. `playwright-report/index.html` on the host opens in a browser and matches that run for both a pass and a failure. The operator does not open the container.

### Implementation for User Story 2

- [X] T008 [P] [US2] Create `entrypoint.sh` that runs `npx playwright test`, keeps the test exit code, clears the contents of `/report` without removing the mount, copies `/tmp/playwright-report` to `/report` when that directory exists, and exits with the test exit code on both pass and fail
- [X] T009 [P] [US2] Create `docker-compose.yml` with service `wiki-language`, `env_file: .env`, `ipc: host`, and volume `./playwright-report:/report`, and with no credential values
- [X] T010 [US2] Create `Dockerfile` from `mcr.microsoft.com/playwright:v1.64.1-noble` after confirming that tag exists (if Noble is unpublished for 1.64.1, use the Ubuntu tag Microsoft published for 1.64.1), install dependencies with `npm ci`, set `PLAYWRIGHT_HTML_REPORT_DIR=/tmp/playwright-report`, and start `entrypoint.sh`

**Checkpoint**: User Stories 1 and 2 both work. The supported run is the container command in `specs/001-wiki-language-switch/contracts/operator-run.md`.

---

## Phase 5: User Story 3 - Reader learns the case and how to run it (Priority: P3)

**Goal**: The project description states the automated test case, how to run the check, and where the host report is

**Independent Test**: Using only `README.md`, a reader can name the precondition, the Preferences → User profile → Internationalization path, the save action, and the expected result, then run the container and open `playwright-report/index.html`

### Implementation for User Story 3

- [X] T011 [US3] Write `README.md` with the test case (precondition: authorized user, credentials only in the local environment file; path: Preferences → User profile → Internationalization; action: select the target language and save; expected result: the interface is shown in that language), the command `docker compose run --rm wiki-language`, and the host report `playwright-report/index.html`. Keep the word Internationalization in that path. The on-screen section title is not part of the written case. Name `WIKIPEDIA_USERNAME` and `WIKIPEDIA_PASSWORD` as empty values copied from `.env.example`. Do not write any account username or password.

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Secret scan and the quickstart run

- [X] T012 Search `README.md`, `.env.example`, `tests/language-switch.spec.ts`, `playwright.config.ts`, `Dockerfile`, `docker-compose.yml`, and `entrypoint.sh` and remove any real username or password so only `process.env` names remain
- [X] T013 Run the validation in `specs/001-wiki-language-switch/quickstart.md` with a local `.env` and confirm `playwright-report/index.html` is on the host

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Then sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on the desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependency on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — runs the User Story 1 check inside the container, so it needs `tests/language-switch.spec.ts`
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — the description must match the User Story 2 command and report path, so finish it after Phase 4

### Within Each User Story

- T007 depends on T006
- T010 depends on T008
- T009 does not depend on T008 or T010

### Parallel Opportunities

- T002, T003, and T004 can run in parallel after T001 starts
- T008 and T009 can run in parallel
- User stories are otherwise sequential because US2 executes the US1 spec and US3 documents the US2 command

---

## Parallel Example: User Story 2

```bash
Task: "Create entrypoint.sh that copies /tmp/playwright-report to /report"
Task: "Create docker-compose.yml with service wiki-language and volume ./playwright-report:/report"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `npx playwright test` with credentials in the environment
5. Add the container and the project description only after that check passes

### Incremental Delivery

1. Setup + Foundational → configuration ready
2. User Story 1 → language switch proven locally (MVP)
3. User Story 2 → same check in a container, HTML report on the host
4. User Story 3 → a reader can run it from `README.md` alone
5. Polish → secret scan and `quickstart.md` validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. After that, T002–T004 are already done; US2 file tasks T008 and T009 can be written while US1 is implemented, but the container run waits for T006
3. US3 waits until the compose command and report path are final

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps a task to a specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate that story independently
- Do not commit `.env` or real Wikipedia credentials
