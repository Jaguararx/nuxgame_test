# Quickstart: Wikipedia Interface Language Switch

Validation guide for the operator run. Implementation steps belong in `tasks.md`. Field rules are in [data-model.md](data-model.md). The command and report contract are in [contracts/operator-run.md](contracts/operator-run.md).

## Prerequisites

- Docker, with Compose v2.
- A Wikipedia account that signs in with a username and password and does not ask for a second verification step.
- Network access from the container to `https://en.wikipedia.org`.

## Setup

1. Copy `.env.example` to `.env` in the repository root.
2. Set `WIKIPEDIA_USERNAME` and `WIKIPEDIA_PASSWORD` in `.env`. Do not commit `.env`.

## Run

```text
docker compose run --rm wiki-language
```

The image build and the browser run happen inside the container. The command is finished when that process exits.

## Expected outcome

- Exit `0` when the signed-in account's interface language changes to Ukrainian, or to English if it was already Ukrainian, and the preferences heading matches that language.
- Exit non-zero when sign-in or the language change fails.
- In both completed runs, `playwright-report/index.html` on the host opens in a browser and matches the run that just finished.
- A second run replaces that report.
- The account is left in the language that was selected. The check does not change it back.

## What the project description must let a reader do

Using only `README.md`, a reader can find the written test case (precondition, Preferences → User profile → Internationalization, save, interface shown in the selected language), run the command above, and open `playwright-report/index.html`.
