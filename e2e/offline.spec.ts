import { expect, test } from '@playwright/test'

test('opens offline and keeps a local record', async ({ page, context }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '轻释压' })).toBeVisible()
  await page.evaluate(() => navigator.serviceWorker?.ready)
  await page.reload()

  await page.getByRole('link', { name: '记录' }).click()
  await page.getByRole('button', { name: '5', exact: true }).click()
  await page.getByRole('button', { name: '保存', exact: true }).click()
  await expect(page.getByRole('heading', { name: '轻释压' })).toBeVisible()
  await expect(page.getByText('已有 1 次记录')).toBeVisible()

  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { name: '轻释压' })).toBeVisible()
  await expect(page.getByText('已有 1 次记录')).toBeVisible()
})
