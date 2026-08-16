import '../styles/tokens.css'
import { useState } from 'react'
import { EntryFlow } from '../features/entry/EntryFlow'
import { HomePage } from '../features/home/HomePage'
import { ReviewPage } from '../features/review/ReviewPage'

export function App() {
  const [page, setPage] = useState<'home' | 'entry' | 'review'>('home')
  return (
    <div className="app-shell">
      {page === 'home' && <HomePage onRecord={() => setPage('entry')} onReview={() => setPage('review')} />}
      {page === 'entry' && <main className="app-content"><button type="button" className="text-action" onClick={() => setPage('home')}>返回首页</button><EntryFlow onSaved={() => setPage('home')} /></main>}
      {page === 'review' && <ReviewPage onBack={() => setPage('home')} />}
      <nav className="bottom-nav" aria-label="主要导航">
        <button type="button" onClick={() => setPage('home')} aria-current={page === 'home' ? 'page' : undefined}>首页</button>
        <button type="button" onClick={() => setPage('review')} aria-current={page === 'review' ? 'page' : undefined}>回顾</button>
        <a href="#settings">设置</a>
      </nav>
    </div>
  )
}
