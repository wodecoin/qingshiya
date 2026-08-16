import { expect, test } from '@playwright/test'

test('entry flow exposes named controls and supports keyboard completion', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: '记录' }).click()

  await expect(page.getByRole('heading', { name: '此刻的压力有多强？' })).toBeVisible()
  await expect(page.getByRole('group', { name: '压力强度' })).toBeVisible()
  await expect(page.getByRole('button', { name: '下一步' })).toBeVisible()

  await page.getByRole('button', { name: '5', exact: true }).click()
  await page.getByRole('button', { name: '下一步', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: '最贴近的原初情绪' })).toBeVisible()

  await page.getByRole('button', { name: '保存', exact: true }).focus()
  await expect(page.getByRole('button', { name: '保存', exact: true })).toBeFocused()
})

test('exercise timer updates without taking focus from the user', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: '练习' }).click()
  await page.getByRole('button', { name: '开始' }).first().click()

  const intensity = page.getByRole('spinbutton', { name: '练习后强度' })
  await intensity.focus()
  await page.getByRole('button', { name: '开始练习' }).click()
  await expect(intensity).toBeFocused()
  await expect(page.getByRole('timer')).toHaveAttribute('aria-live', 'off')
})
