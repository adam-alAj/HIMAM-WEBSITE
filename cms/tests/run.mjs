/**
 * API-test harness — boots Strapi against the configured database, waits for
 * the public API to become healthy, runs tests/api.test.mjs, then tears the
 * server down. Exit code mirrors the test suite, so CI fails on any failure.
 *
 * Usage:
 *   npm run test:api
 *
 * Requires a reachable Postgres (locally: `npm run db:up` + cms/.env, or set
 * the DATABASE_* env vars below). CI passes its own env (postgres service
 * container) — see .github/workflows/ci.yml.
 */
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const cmsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const port = process.env.PORT ?? '1337'
const baseUrl = `http://127.0.0.1:${port}`

// Test-only secrets — never used outside the harness/CI; production values
// come from cms/.env or GitHub Actions secrets.
const env = {
  ...process.env,
  HOST: '0.0.0.0',
  PORT: port,
  APP_KEYS: process.env.APP_KEYS ?? 'testAppKeys1,testAppKeys2',
  API_TOKEN_SALT: process.env.API_TOKEN_SALT ?? 'testApiTokenSalt',
  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET ?? 'testAdminJwtSecret',
  TRANSFER_TOKEN_SALT: process.env.TRANSFER_TOKEN_SALT ?? 'testTransferTokenSalt',
  JWT_SECRET: process.env.JWT_SECRET ?? 'testJwtSecret',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ?? 'testEncryptionKey',
  DATABASE_CLIENT: process.env.DATABASE_CLIENT ?? 'postgres',
  DATABASE_HOST: process.env.DATABASE_HOST ?? '127.0.0.1',
  DATABASE_PORT: process.env.DATABASE_PORT ?? '5432',
  DATABASE_NAME: process.env.DATABASE_NAME ?? 'himam',
  DATABASE_USERNAME: process.env.DATABASE_USERNAME ?? 'himam',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? 'himam_dev_pw',
  DATABASE_SSL: process.env.DATABASE_SSL ?? 'false',
  SEED_DEMO_CONTENT: 'true',
}

const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm'
console.log(`[test] booting Strapi on :${port} (DB: ${env.DATABASE_CLIENT}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME})`)

const server = spawn(npmBin, ['run', 'develop'], {
  cwd: cmsDir,
  env,
  stdio: ['ignore', 'pipe', 'pipe'],
})

server.stdout.on('data', (chunk) => process.stdout.write(`[cms] ${chunk}`))
server.stderr.on('data', (chunk) => process.stderr.write(`[cms] ${chunk}`))

let exitedEarly = false
server.on('exit', (code) => {
  exitedEarly = true
  console.error(`[test] Strapi exited early with code ${code}`)
})

async function waitForHealth(timeoutMs = 300_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (exitedEarly) throw new Error('Strapi exited before becoming healthy')
    try {
      const response = await fetch(`${baseUrl}/api/services`)
      if (response.ok) return
    } catch {
      // Not up yet — keep polling.
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
  throw new Error(`Strapi did not become healthy within ${timeoutMs / 1000}s`)
}

let exitCode = 1
try {
  await waitForHealth()
  console.log('[test] Strapi healthy — running API suite…')
  const result = spawnSync(process.execPath, ['--test', 'tests/api.test.mjs'], {
    cwd: cmsDir,
    env: { ...process.env, CMS_URL: baseUrl },
    stdio: 'inherit',
  })
  exitCode = result.status ?? 1
} catch (error) {
  console.error(`[test] ${error.message}`)
} finally {
  console.log('[test] shutting down Strapi…')
  server.kill('SIGTERM')
  // Force-kill if graceful shutdown lingers (Windows can be slow here).
  setTimeout(() => server.kill('SIGKILL'), 5000).unref()
}

process.exit(exitCode)
