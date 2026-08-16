import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { MAX_PRIMARY_EMOTIONS, MAX_SECONDARY_REACTIONS } from '../domain/types'
import { entriesRepository } from './entriesRepository'
import { settingsRepository } from './settingsRepository'

const validEntry = {
  intensityBefore: 7,
  primaryEmotions: ['焦虑'],
  secondaryReactions: ['逃避'],
  bodySignals: ['心跳加快'],
  behaviorUrges: ['刷手机'],
  note: '有逗号, 有引号 "和换行\n的备注',
}

describe('entriesRepository', () => {
  beforeEach(async () => {
    await indexedDB.deleteDatabase('qingshiya')
  })

  it('creates and reads an entry without optional exercise data', async () => {
    const created = await entriesRepository.create(validEntry)

    expect(created.id).toEqual(expect.any(String))
    expect(created.createdAt).toEqual(expect.any(String))
    expect(created.exerciseId).toBeUndefined()
    expect(created.intensityAfter).toBeUndefined()
    await expect(entriesRepository.list()).resolves.toEqual([created])
  })

  it('rejects emotion and reaction selections over their limits', async () => {
    await expect(entriesRepository.create({
      ...validEntry,
      primaryEmotions: Array(MAX_PRIMARY_EMOTIONS + 1).fill('情绪'),
    })).rejects.toThrow(/primaryEmotions/)

    await expect(entriesRepository.create({
      ...validEntry,
      secondaryReactions: Array(MAX_SECONDARY_REACTIONS + 1).fill('反应'),
    })).rejects.toThrow(/secondaryReactions/)
  })

  it('accepts only intensity values from 1 through 10', async () => {
    await expect(entriesRepository.create({ ...validEntry, intensityBefore: 0 })).rejects.toThrow(/intensityBefore/)
    await expect(entriesRepository.create({ ...validEntry, intensityBefore: 11 })).rejects.toThrow(/intensityBefore/)
    await expect(entriesRepository.create({ ...validEntry, intensityAfter: 0 })).rejects.toThrow(/intensityAfter/)
    await expect(entriesRepository.create({ ...validEntry, intensityAfter: 11 })).rejects.toThrow(/intensityAfter/)
  })

  it('filters, updates, and deletes entries', async () => {
    const older = await entriesRepository.create({ ...validEntry, createdAt: '2026-01-01T00:00:00.000Z' })
    const newer = await entriesRepository.create({ ...validEntry, createdAt: '2026-02-01T00:00:00.000Z' })

    await expect(entriesRepository.list({ from: '2026-02-01T00:00:00.000Z' })).resolves.toEqual([newer])
    const updated = await entriesRepository.update({ ...older, intensityAfter: 3 })
    expect(updated.intensityAfter).toBe(3)
    await entriesRepository.delete(newer.id)
    await expect(entriesRepository.list()).resolves.toEqual([updated])
  })

  it('exports complete JSON and escaped CSV', async () => {
    const created = await entriesRepository.create(validEntry)

    const json = await entriesRepository.export('json')
    expect(JSON.parse(json)).toEqual([created])

    const csv = await entriesRepository.export('csv')
    expect(csv).toContain('日期,压力前强度,压力后强度,原初情绪,次生反应,身体反应,行为冲动,练习,备注')
    expect(csv).toContain('"有逗号, 有引号 ""和换行\n的备注"')
  })

  it('reads defaults and persists settings patches locally', async () => {
    await expect(settingsRepository.get()).resolves.toEqual({
      onboardingCompleted: false,
      reminderEnabled: false,
    })
    await settingsRepository.update({ reminderEnabled: true, preferredReminderTime: '09:30' })
    await expect(settingsRepository.get()).resolves.toEqual({
      onboardingCompleted: false,
      reminderEnabled: true,
      preferredReminderTime: '09:30',
    })
  })
})
