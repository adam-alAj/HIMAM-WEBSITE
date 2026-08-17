import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // In development, forward CMS API calls (/api/...) and uploaded media
      // (/uploads/...) to the local Strapi instance so the browser uses
      // same-origin relative URLs (no CORS config in dev). Override the target
      // with CMS_API_URL in frontend/.env if Strapi runs elsewhere.
      '/api': {
        target: process.env.CMS_API_URL ?? 'http://localhost:1337',
        changeOrigin: true,
      },
      '/uploads': {
        target: process.env.CMS_API_URL ?? 'http://localhost:1337',
        changeOrigin: true,
      },
    },
  },
})
