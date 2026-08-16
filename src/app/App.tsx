import '../styles/tokens.css'
import { useState } from 'react'
import { ExerciseLibrary } from '../features/exercises/ExerciseLibrary'
import { EntryFlow } from '../features/entry/EntryFlow'
import { HomePage } from '../features/home/HomePage'
import { ReviewPage } from '../features/review/ReviewPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { AppPage, routeLabels } from './routes'

export function App() {
  const [page, setPage] = useState<AppPage>('home')
  const navigate = (nextPage: AppPage) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setPage(nextPage)
  }

  return (
    <div className="app-shell">
      {page === 'home' && <HomePage onRecord={() => setPage('entry')} onReview={() => setPage('review')} onExercises={() => setPage('exercises')} />}
      {page === 'entry' && <main className="app-content"><button type="button" className="text-action" onClick={() => setPage('home')}>返回首页</button><EntryFlow onSaved={() => setPage('home')} /></main>}
      {page === 'exercises' && <main className="app-content"><ExerciseLibrary /></main>}
      {page === 'review' && <ReviewPage onBack={() => setPage('home')} />}
      {page === 'settings' && <SettingsPage />}
      <nav className="bottom-nav" aria-label="主要导航">
        {(Object.keys(routeLabels) as AppPage[]).map((route) => <a key={route} className="nav-touch-target" data-min-touch-target="44px" href={`#${route}`} onClick={navigate(route)} aria-current={page === route ? 'page' : undefined}>{routeLabels[route]}</a>)}
      </nav>
    </div>
  )
}
