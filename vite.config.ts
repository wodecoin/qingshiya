import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/qingshiya/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '轻释压',
        short_name: '轻释压',
        start_url: '/qingshiya/',
        scope: '/qingshiya/',
        display: 'standalone',
        theme_color: '#edf7ff',
        background_color: '#f5efff',
        icons: [],
      },
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
