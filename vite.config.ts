import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [{
          urlPattern: ({ request }) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
          handler: 'NetworkFirst',
          options: { cacheName: 'qingshiya-app-shell', networkTimeoutSeconds: 3 },
        }],
      },
    }),
  ],
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
