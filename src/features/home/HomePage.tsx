import { useEffect, useState } from 'react'
import type { StressEntry } from '../../domain/types'
import { entriesRepository } from '../../storage/entriesRepository'
import { selectWindowEntries } from '../review/reviewSelectors'

interface HomeRepository { list: () => Promise<StressEntry[]> }
interface HomePageProps { entries?: StressEntry[]; repository?: HomeRepository; onRecord?: () => void; onReview?: () => void; onExercises?: () => void }

export function HomePage({ entries: suppliedEntries, repository = entriesRepository, onRecord, onReview, onExercises }: HomePageProps) {
  const [entries, setEntries] = useState<StressEntry[]>(suppliedEntries ?? [])
  useEffect(() => { if (suppliedEntries === undefined) void repository.list().then(setEntries).catch(() => setEntries([])) }, [repository, suppliedEntries])
  const recent = selectWindowEntries(entries, 7)
  const latest = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3)

  return <main className="app-content home-page">
    <p className="eyebrow">给心里留一点空间</p>
    <h1>轻释压</h1>
    <section className="welcome-card" aria-labelledby="welcome-title"><div className="welcome-orb" aria-hidden="true">☁</div><div><h2 id="welcome-title">今天感觉怎么样？</h2><p>不用急着解决所有事情，先把此刻的感受放下来。</p></div><button type="button" className="primary-action" onClick={onRecord}>记录一次压力</button></section>
    <section className="home-summary" aria-labelledby="summary-title"><p className="section-kicker">最近 7 天</p><h2 id="summary-title">{recent.length ? `已有 ${recent.length} 次记录` : '从一次轻轻的记录开始'}</h2><p>{recent.length ? '回看记录，不急着给它下结论。' : '这里会留下一些属于你的观察，不伪造示例数据。'}</p><button type="button" className="secondary-action" onClick={onReview}>查看复盘</button></section>
    {latest.length > 0 && <section className="recent-list" aria-labelledby="recent-title"><h2 id="recent-title">最近记录</h2><ul>{latest.map((entry) => <li key={entry.id}><time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleDateString()}</time><span>压力 {entry.intensityBefore} 分</span></li>)}</ul></section>}
    <button type="button" className="exercise-link" onClick={onExercises}>去做一个练习</button>
  </main>
}
