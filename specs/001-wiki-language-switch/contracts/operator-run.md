# Contract: Operator run

The project exposes one command to the operator. It does not expose an API.

## Inputs

| Name | Required | Source |
| --- | --- | --- |
| `WIKIPEDIA_USERNAME` | Yes | Local `.env`, injected by Compose. Never committed. |
| `WIKIPEDIA_PASSWORD` | Yes | Local `.env`, injected by Compose. Never committed. |

Empty or missing values are a failed check, not a prompt.

## Command

From the repository root, with Docker available and `.env` present:

```text
docker compose run --rm wiki-language
```

No further input is required after the command starts.

## Outputs

| Result | Process exit | Host files |
| --- | --- | --- |
| Interface language changed as specified | `0` | `playwright-report/index.html` shows a passed check |
| Sign-in failed, preferences could not be saved, or the interface stayed in the previous language | non-zero | `playwright-report/index.html` shows the failure and does not show a passed check |
| Container never launched the check (Docker not running, image build failed, `.env` file absent so Compose did not start) | non-zero | No new report is required |

The HTML report is Playwright's built-in report. The operator opens `playwright-report/index.html` on the host. They do not open the container.

## Side effect

A successful or unsuccessful completed check may leave the Wikipedia account in Ukrainian or English. No other preference is changed.
