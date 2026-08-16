import { useEffect, useState } from 'react'
import type { StressEntry } from '../../domain/types'
import { entriesRepository } from '../../storage/entriesRepository'
import { averageChangeByExercise, countExercises, countTags, selectTrend, selectWindowEntries, type TagGroup } from './reviewSelectors'
import { TrendChart } from './TrendChart'

interface ReviewRepository { list: () => Promise<StressEntry[]> }
interface ReviewPageProps { entries?: StressEntry[]; repository?: ReviewRepository; onBack?: () => void }
const groupNames: Record<TagGroup, string> = { primaryEmotions: '原初情绪', secondaryReactions: '次生反应', bodySignals: '身体信号', behaviorUrges: '行为冲动' }

export function ReviewPage({ entries: suppliedEntries, repository = entriesRepository, onBack }: ReviewPageProps) {
  const [entries, setEntries] = useState<StressEntry[]>(suppliedEntries ?? [])
  useEffect(() => { if (suppliedEntries === undefined) void repository.list().then(setEntries).catch(() => setEntries([])) }, [repository, suppliedEntries])
  const recent = selectWindowEntries(entries, 7)
  const month = selectWindowEntries(entries, 30)
  const tags = countTags(month)
  const exerciseCounts = countExercises(month)
  const changes = averageChangeByExercise(month)

  return <main className="app-content review-page">
    <button type="button" className="text-action" onClick={onBack}>返回首页</button>
    <p className="eyebrow">给自己一点回看的时间</p>
    <h1>复盘</h1>
    <section className="review-section" aria-labelledby="week-title"><p className="section-kicker">最近 7 天</p><h2 id="week-title">记录中的变化</h2><p>{selectTrend(recent).label}</p><TrendChart entries={recent} /></section>
    <section className="review-section" aria-labelledby="tag-title"><p className="section-kicker">最近 30 天</p><h2 id="tag-title">你记录过的体验</h2><div className="tag-groups">{(Object.keys(groupNames) as TagGroup[]).map((group) => <div className="tag-group" key={group}><h3>{groupNames[group]}</h3>{Object.keys(tags[group]).length === 0 ? <p className="review-muted">暂时没有</p> : <ul>{Object.entries(tags[group]).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([tag, count]) => <li key={tag}><span>{tag}</span><strong>{count}</strong></li>)}</ul>}</div>)}</div></section>
    <section className="review-section" aria-labelledby="exercise-review-title"><h2 id="exercise-review-title">练习记录</h2>{Object.keys(exerciseCounts).length === 0 ? <p>还没有练习记录，可以从一次短练习开始。</p> : <ul className="exercise-summary">{Object.entries(exerciseCounts).map(([exerciseId, count]) => <li key={exerciseId}><span>{exerciseId}</span><span>使用 {count} 次{changes[exerciseId] !== undefined && `，记录中的平均变化 ${changes[exerciseId] > 0 ? '+' : ''}${changes[exerciseId].toFixed(1)} 分`}</span></li>)}</ul>}</section>
  </main>
}
