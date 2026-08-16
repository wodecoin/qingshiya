import { expect, test } from '@playwright/test'

test('serves the app shell', async ({ request }) => {
  const response = await request.get('/')

  expect(response.ok()).toBe(true)
  await expect(response).toBeOK()
  await expect(await response.text()).toContain('轻释压')
})
