import type { StressEntry } from '../../domain/types'

export type TagGroup = 'primaryEmotions' | 'secondaryReactions' | 'bodySignals' | 'behaviorUrges'
export type TagCounts = Record<TagGroup, Record<string, number>>

const tagGroups: TagGroup[] = ['primaryEmotions', 'secondaryReactions', 'bodySignals', 'behaviorUrges']

function localDayStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function selectWindowEntries(entries: StressEntry[], days: 7 | 30, now = new Date()): StressEntry[] {
  const end = localDayStart(now)
  end.setDate(end.getDate() + 1)
  const start = new Date(end)
  start.setDate(start.getDate() - days)
  return entries.filter((entry) => {
    const createdAt = new Date(entry.createdAt).getTime()
    return createdAt >= start.getTime() && createdAt < end.getTime()
  })
}

export function countTags(entries: StressEntry[]): TagCounts {
  return tagGroups.reduce((groups, group) => {
    groups[group] = entries.flatMap((entry) => entry[group]).reduce<Record<string, number>>((counts, tag) => {
      counts[tag] = (counts[tag] ?? 0) + 1
      return counts
    }, {})
    return groups
  }, {} as TagCounts)
}

export function countExercises(entries: StressEntry[]): Record<string, number> {
  return entries.reduce<Record<string, number>>((counts, entry) => {
    if (entry.exerciseId) counts[entry.exerciseId] = (counts[entry.exerciseId] ?? 0) + 1
    return counts
  }, {})
}

export function averageChangeByExercise(entries: StressEntry[]): Record<string, number> {
  const totals = entries.reduce<Record<string, { total: number; count: number }>>((result, entry) => {
    if (entry.exerciseId && entry.intensityAfter !== undefined) {
      const current = result[entry.exerciseId] ?? { total: 0, count: 0 }
      current.total += entry.intensityAfter - entry.intensityBefore
      current.count += 1
      result[entry.exerciseId] = current
    }
    return result
  }, {})
  return Object.fromEntries(Object.entries(totals).map(([id, value]) => [id, value.total / value.count]))
}

export function selectTrend(entries: StressEntry[]): { sampleSize: number; label: string } {
  if (entries.length < 3) return { sampleSize: entries.length, label: '记录还不够，继续观察' }
  const ordered = [...entries].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  const midpoint = Math.ceil(ordered.length / 2)
  const average = (values: StressEntry[]) => values.reduce((total, entry) => total + entry.intensityBefore, 0) / values.length
  const difference = average(ordered.slice(midpoint)) - average(ordered.slice(0, midpoint))
  const direction = difference < -0.5 ? '下降' : difference > 0.5 ? '上升' : '没有明显方向'
  return { sampleSize: entries.length, label: `记录中的变化：压力强度整体${direction}` }
}
