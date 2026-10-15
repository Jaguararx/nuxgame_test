FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json playwright.config.ts entrypoint.sh ./
COPY tests ./tests

ENV PLAYWRIGHT_HTML_REPORT_DIR=/tmp/playwright-report
ENV PLAYWRIGHT_OUTPUT_DIR=/tmp/test-results

RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

ENTRYPOINT ["sh", "/app/entrypoint.sh"]
