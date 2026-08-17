import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end tests run the REAL stack: Strapi (CMS + Postgres) and the Vite
 * app proxying /api → Strapi. Two web servers are booted by Playwright:
 *
 *   1. CMS  — `npm --prefix ../cms run develop` (seeds on first boot, grants
 *      public read + exposes the POST /api/contact-submissions endpoint).
 *      Needs a reachable Postgres: locally `npm run db:up` + cms/.env;
 *      in CI a postgres service container + job env (see .github/workflows).
 *   2. App  — the Vite dev server on :4173 with its /api proxy pointed at :1337.
 *
 * Local runs reuse already-running servers (reuseExistingServer) so you can
 * keep `npm run dev:cms` up and iterate on specs only.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm --prefix ../cms run develop',
      url: 'http://localhost:1337/api/services',
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
      // Test-only values; real secrets never live here (CI passes its own env).
      env: {
        ...process.env,
        HOST: '0.0.0.0',
        PORT: '1337',
        APP_KEYS: 'e2eAppKeys1,e2eAppKeys2',
        API_TOKEN_SALT: 'e2eApiTokenSalt',
        ADMIN_JWT_SECRET: 'e2eAdminJwtSecret',
        TRANSFER_TOKEN_SALT: 'e2eTransferTokenSalt',
        JWT_SECRET: 'e2eJwtSecret',
        ENCRYPTION_KEY: 'e2eEncryptionKey',
        DATABASE_CLIENT: process.env.DATABASE_CLIENT ?? 'postgres',
        DATABASE_HOST: process.env.DATABASE_HOST ?? '127.0.0.1',
        DATABASE_PORT: process.env.DATABASE_PORT ?? '5432',
        DATABASE_NAME: process.env.DATABASE_NAME ?? 'himam',
        DATABASE_USERNAME: process.env.DATABASE_USERNAME ?? 'himam',
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? 'himam_dev_pw',
        DATABASE_SSL: process.env.DATABASE_SSL ?? 'false',
        SEED_DEMO_CONTENT: 'true',
      },
    },
    {
      command: 'npm run dev -- --port 4173',
      url: 'http://localhost:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...process.env,
        CMS_API_URL: 'http://localhost:1337',
      },
    },
  ],
})
