import { describe, expect, it } from 'vitest'
import type { StressEntry } from '../../domain/types'
import { averageChangeByExercise, countExercises, countTags, selectTrend, selectWindowEntries } from './reviewSelectors'

const entry = (overrides: Partial<StressEntry>): StressEntry => ({
  id: 'entry',
  createdAt: '2026-08-17T12:00:00.000Z',
  intensityBefore: 7,
  primaryEmotions: ['紧张'],
  secondaryReactions: ['担心'],
  bodySignals: ['心跳加快'],
  behaviorUrges: ['逃避'],
  ...overrides,
})

describe('review selectors', () => {
  it('selects entries from the local calendar window, including today', () => {
    const entries = [
      entry({ id: 'today', createdAt: '2026-08-17T00:05:00.000Z' }),
      entry({ id: 'old', createdAt: '2026-08-01T12:00:00.000Z' }),
    ]

    expect(selectWindowEntries(entries, 7, new Date('2026-08-17T12:00:00.000Z')).map(({ id }) => id)).toEqual(['today'])
    expect(selectWindowEntries(entries, 30, new Date('2026-08-17T12:00:00.000Z')).map(({ id }) => id)).toEqual(['today', 'old'])
  })

  it('ends at the next local calendar day across a daylight-saving transition', () => {
    const runtime = globalThis as typeof globalThis & { process?: { env: Record<string, string | undefined> } }
    const previousTimeZone = runtime.process?.env.TZ
    if (runtime.process) runtime.process.env.TZ = 'America/New_York'
    try {
      const entries = [
        entry({ id: 'today', createdAt: '2026-03-08T23:59:00-04:00' }),
        entry({ id: 'tomorrow', createdAt: '2026-03-09T00:30:00-04:00' }),
      ]

      expect(selectWindowEntries(entries, 7, new Date(2026, 2, 8, 12))).toEqual([entries[0]])
    } finally {
      if (runtime.process) runtime.process.env.TZ = previousTimeZone
    }
  })

  it('returns empty counts for empty data and keeps four tag groups separate', () => {
    expect(countTags([])).toEqual({ primaryEmotions: {}, secondaryReactions: {}, bodySignals: {}, behaviorUrges: {} })
    expect(countTags([entry({ primaryEmotions: ['紧张'], secondaryReactions: ['担心', '担心'], bodySignals: [], behaviorUrges: ['逃避'] })])).toEqual({
      primaryEmotions: { 紧张: 1 },
      secondaryReactions: { 担心: 2 },
      bodySignals: {},
      behaviorUrges: { 逃避: 1 },
    })
  })

  it('counts exercises and averages only entries with a post-exercise intensity', () => {
    const entries = [
      entry({ id: 'one', exerciseId: 'breathing', intensityBefore: 8, intensityAfter: 4 }),
      entry({ id: 'two', exerciseId: 'breathing', intensityBefore: 6 }),
      entry({ id: 'three', exerciseId: 'grounding', intensityBefore: 5, intensityAfter: 3 }),
    ]

    expect(countExercises(entries)).toEqual({ breathing: 2, grounding: 1 })
    expect(averageChangeByExercise(entries)).toEqual({ breathing: -4, grounding: -2 })
  })

  it('does not make a trend judgement with fewer than three entries', () => {
    expect(selectTrend([entry({ id: 'one' }), entry({ id: 'two' })])).toEqual({ sampleSize: 2, label: '记录还不够，继续观察' })
    expect(selectTrend([entry({ id: 'one', intensityBefore: 8 }), entry({ id: 'two', intensityBefore: 7 }), entry({ id: 'three', intensityBefore: 5 })])).toEqual({ sampleSize: 3, label: '记录中的变化：压力强度整体下降' })
  })
})
