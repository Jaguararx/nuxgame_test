# Wikipedia interface language switch

Automated check that an authorized Wikipedia user can change the interface language.

## Test case

**Precondition:** An authorized Wikipedia user. The username and password are in a local `.env` file, not in this project.

**Steps:**

1. Sign in to English Wikipedia.
2. Open Preferences.
3. Open global preferences.
4. Check the box that enables the language dropdown, if it is not already checked.
5. Select Ukrainian if the interface is not Ukrainian. If it is already Ukrainian, select English.
6. Press Save at the bottom of the page.
7. Open the home page.

**Expected result:** The interface is shown in the selected language on Preferences and on the home page. The preferences heading is `Налаштування` for Ukrainian or `Preferences` for English. The home page privacy-policy link is `Політика конфіденційності` or `Privacy policy`. The page language matches that choice on both pages.

## Run

1. Copy `.env.example` to `.env`.
2. Set `WIKIPEDIA_USERNAME` and `WIKIPEDIA_PASSWORD`. Leave them empty in `.env.example`. Do not commit `.env`.
3. Make sure the Docker Desktop is running.
4. From the repository root:

```text
docker compose run --rm wiki-language
```

Docker and a network path to English Wikipedia are required. The command needs no further input. It runs the tests in this folder. Rebuild the image with `docker compose build` only after `package.json` changes.

## Report

After the run, open `playwright-report/index.html` on this computer. The report is not left only inside the container. A passed run and a failed run both replace that file when the check itself ran. A failed run includes a screenshot of the page.
