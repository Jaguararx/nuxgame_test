#!/bin/sh
set -u
npx playwright test
status=$?
mkdir -p /report
find /report -mindepth 1 -maxdepth 1 -exec rm -rf {} +
if [ -d /tmp/playwright-report ]; then
  cp -a /tmp/playwright-report/. /report/
fi
if [ -d /tmp/test-results ]; then
  mkdir -p /report/test-results
  cp -a /tmp/test-results/. /report/test-results/
fi
exit "$status"