import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Unit tests (Jest-compatible API via Vitest). Kept separate from vite.config.ts
// so test-only settings (jsdom, setup file) never leak into the dev/build config.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
    // E2E specs live in e2e/ and are run by Playwright, not Vitest.
    exclude: ['e2e/**', 'node_modules/**'],
    // The default 'forks' pool can time out spawning workers on Windows;
    // 'threads' is more reliable across platforms and CI runners.
    pool: 'threads',
  },
})
