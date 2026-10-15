#!/bin/sh
set -u
npx playwright test
status=$?
mkdir -p /report
find /report -mindepth 1 -maxdepth 1 -exec rm -rf {} +
if [ -d /tmp/playwright-report ]; then
  cp -a /tmp/playwright-report/. /report/
fi
exit "$status"