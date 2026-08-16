import { expect, test } from '@playwright/test'

test('entry flow exposes named controls and supports keyboard completion', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: '记录' }).click()

  await expect(page.getByRole('heading', { name: '此刻的压力有多强？' })).toBeVisible()
  await expect(page.getByRole('group', { name: '压力强度' })).toBeVisible()
  await expect(page.getByRole('button', { name: '下一步' })).toBeVisible()

  const activate = async (name: string, exact = true) => {
    const control = page.getByRole('button', { name, exact }).first()
    await control.focus()
    await page.keyboard.press('Enter')
  }

  await activate('5')
  await activate('下一步')
  await activate('喜悦', false)
  await activate('下一步')
  await activate('担心', false)
  await activate('下一步')
  await activate('心跳加快', false)
  await activate('下一步')
  await activate('逃避', false)
  await activate('下一步')
  await activate('跳过此步')
  await expect(page.getByRole('heading', { name: '确认这次记录' })).toBeVisible()
  await activate('保存记录')
  await expect(page.getByRole('heading', { name: '轻释压' })).toBeVisible()
  await expect(page.getByText(/已有 \d+ 次记录/)).toBeVisible()
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
