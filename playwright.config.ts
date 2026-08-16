import { defineConfig, devices } from '@playwright/test'

const localHosts = 'localhost,127.0.0.1'
for (const proxyVariable of ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'http_proxy', 'https_proxy', 'all_proxy']) {
  delete process.env[proxyVariable]
}
process.env.NO_PROXY = [process.env.NO_PROXY, localHosts].filter(Boolean).join(',')
process.env.no_proxy = [process.env.no_proxy, localHosts].filter(Boolean).join(',')

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    stdout: 'pipe',
    wait: {
      stdout: /Local:\s+http:\/\/127\.0\.0\.1:5173/,
    },
    timeout: 30_000,
    reuseExistingServer: false,
  },
})
