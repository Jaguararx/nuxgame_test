# Feature Specification: Wikipedia Interface Language Switch

**Feature Branch**: `001-wiki-language-switch`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "Verify that an authorized user of the Wikipedia web application can change the interface display language from Preferences (User profile tab, Internationalization) and then see the interface in that language. Deliver a written test case, an automated test of that case, a container run that leaves an HTML report in a folder on the host computer, credentials only as environment variables in a local environment file, and a project description that includes the test case plus how to run the test and where to find the report."

## Clarifications

### Session 2026-10-15

- Q: Which two interface languages should the check switch between? → A: Ukrainian and English. Switch to Ukrainian unless the account is already in Ukrainian, then switch to English.
- Q: What proves the interface language changed? → A: The preferences heading (`Налаштування` or `Preferences`) and the page language. The language control alone is not enough. The on-screen section title is not the proof. The home page must show the same language: its page language and the privacy-policy link (`Privacy policy` or `Політика конфіденційності`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authorized user changes the interface language (Priority: P1)

An authorized Wikipedia user opens Preferences, chooses a different interface language, and the application is then shown in that language.

**Why this priority**: This is the behavior the project exists to prove. Without it, the written case and the automated check have nothing to verify.

**Independent Test**: Sign in with a valid Wikipedia account, change the interface language under Preferences, and confirm the interface uses the newly selected language.

**Acceptance Scenarios**:

1. **Given** an authorized user is signed in and the interface is not Ukrainian, **When** the user opens Preferences, the User profile tab, and the Internationalization section, selects Ukrainian, and saves, **Then** the preferences page and the home page are displayed in Ukrainian.
2. **Given** the interface is already Ukrainian, **When** the user selects English and saves, **Then** the preferences page and the home page are displayed in English.

---

### User Story 2 - Operator runs the check and reads the report on the host (Priority: P2)

An operator starts the automated check inside a container. When the run finishes, an HTML report is on the host computer, and the operator opens it there.

**Why this priority**: The assignment is not complete if the proof stays inside the container or only exists as a manual note.

**Independent Test**: Start one container run with credentials supplied, then open the HTML report from a folder on the host without entering the container.

**Acceptance Scenarios**:

1. **Given** credentials are available to the run and the container can reach Wikipedia, **When** the operator starts the documented container run, **Then** the automated check performs the language-switch case with no further manual steps.
2. **Given** the container run has finished (pass or fail), **When** the operator looks in the documented folder on the host, **Then** an HTML report of that run is present and can be opened in a browser.
3. **Given** the sign-in or the language change fails, **When** the container run finishes, **Then** the report on the host shows the failure and does not show a passed result.

---

### User Story 3 - Reader learns the case and how to run it (Priority: P3)

A reader opens the project description and finds the test case that was automated, how to start the run, and where the HTML report appears.

**Why this priority**: The check cannot be handed to someone else if the case and the run steps live only in the author's head.

**Independent Test**: Using only the project description, a reader can identify the test case, start the container run, and open the host report folder.

**Acceptance Scenarios**:

1. **Given** the project description, **When** a reader looks for what was automated, **Then** they find the language-switch test case, including precondition, steps, and expected result.
2. **Given** the project description, **When** a reader follows it on a machine that has the container runtime and a local environment file, **Then** they can start the run and know which host folder holds the HTML report.

---

### Edge Cases

- The account's current interface language is already Ukrainian. The check selects English so a real change still happens. If the interface is any other language, the check selects Ukrainian.
- The local environment file is missing, or the username or password is empty or wrong. The run fails before it can claim the language changed, and a report is still left on the host if the check executed.
- Preferences saves, but the interface remains in the previous language. The check fails.
- The User profile tab or the Internationalization section cannot be reached. The check fails.
- The container run is interrupted before the check executes. No success is reported. A report is required only when the check itself ran.
- The operator opens the host report folder from an earlier run. The latest run replaces that report so the folder matches the run just finished.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST include a written test case for an authorized user changing the Wikipedia interface language.
- **FR-002**: That test case MUST state the precondition (an authorized user), the path (Preferences, User profile tab, Internationalization), the action (select a different interface display language and save), and the expected result (the application interface is shown in the selected language).
- **FR-003**: An automated check MUST perform that test case against the live Wikipedia web application.
- **FR-004**: The automated check MUST sign in as the authorized user before it opens Preferences.
- **FR-005**: The automated check MUST select Ukrainian when the interface is not already Ukrainian, and English when it is already Ukrainian. It MUST NOT select any other language.
- **FR-006**: The automated check MUST pass only when the preferences heading is `Налаштування` after Ukrainian is selected, or `Preferences` after English is selected, and the page language matches that choice. A change that updates only the language control, while that heading stays in the previous language, MUST fail. The visible section title is not the proof. The check MUST then open the home page and pass only when that page's language and its privacy-policy link (`Privacy policy` or `Політика конфіденційності`) match the same choice.
- **FR-007**: The operator MUST be able to run the automated check inside a container using the steps in the project description.
- **FR-008**: After the check has run in the container, the HTML report MUST be present in a folder on the host computer. The report MUST NOT remain only inside the container.
- **FR-009**: The host report folder MUST be updated for both a passed run and a failed run, as long as the check executed.
- **FR-010**: The username and password MUST be supplied only as environment variables from a local environment file. They MUST NOT appear in source files, the project description, or any other file that is part of the shared project.
- **FR-011**: The project description MUST include the automated test case, how to run the check, and where to find the HTML report on the host.

### Key Entities

- **Authorized user**: A person with an existing Wikipedia account who can sign in with a username and password. The account is provided by the operator; the project does not create it.
- **Interface language**: The display language of the Wikipedia application chrome, chosen under Preferences → User profile → Internationalization. The check uses only Ukrainian and English. It is distinct from the language of an article's content.
- **Test case**: The written precondition, steps, and expected result for the language switch. The automated check and the project description both follow this case.
- **Test report**: An HTML record of one container run, stored in a folder on the host computer.
- **Credentials**: The account username and password, present only as environment variables loaded from the operator's local environment file.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a single signed-in session, after the user saves a different interface language, the preferences heading, the home-page privacy-policy link, and the page language on both pages match that language before the session ends.
- **SC-002**: With a valid local environment file, one documented container run finishes the language-switch case with no further input from the operator.
- **SC-003**: After that run, the operator can open an HTML report from a folder on the host computer without opening the container. The report matches the run that just finished.
- **SC-004**: No shared project file contains the account username or password. Both values are read from the environment at run time.
- **SC-005**: A reader who has only the project description can name the test case, start the run, and locate the host report folder on the first attempt.

## Assumptions

- The application under test is the public English Wikipedia website. Other Wikipedia language projects and the mobile apps are out of scope.
- The operator supplies an existing account that signs in with a username and password and does not ask for a second verification step.
- The only display languages in scope are Ukrainian and English, using the selection rule in FR-005.
- Saving the preference is part of the user action. The check does not treat an unsaved selection as a successful change.
- The check does not restore the previous language afterward. The account may be left in Ukrainian or English.
- The project does not create, delete, or rename accounts, and it does not change any preference other than the interface display language.
- Anonymous visitors, other Preferences tabs, and article-content language are out of scope.
- "A container" means one isolated run started from the project, not a manually assembled machine. The HTML report format is the standard browser-viewable report produced by the automation tool, copied to a folder inside the project on the host.
- The local environment file stays on the operator's machine and is not part of the shared project files.
- A stable network path from the container to Wikipedia is available during the run.
