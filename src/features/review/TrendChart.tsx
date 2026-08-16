import type { StressEntry } from '../../domain/types'

interface TrendChartProps { entries: StressEntry[] }

export function TrendChart({ entries }: TrendChartProps) {
  if (entries.length === 0) return <p className="review-muted">这段时间还没有记录。</p>
  const ordered = [...entries].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  return <div className="trend-chart" role="img" aria-label="压力强度记录图">
    {ordered.map((entry) => <div className="trend-column" key={entry.id} title={`${entry.intensityBefore} 分`}><div className="trend-bar" style={{ height: `${entry.intensityBefore * 10}%` }} /><span>{new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}</span></div>)}
  </div>
}
