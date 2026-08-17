import '../styles/tokens.css'
import { useEffect, useState } from 'react'
import { ExerciseLibrary } from '../features/exercises/ExerciseLibrary'
import { EntryFlow } from '../features/entry/EntryFlow'
import { HomePage } from '../features/home/HomePage'
import { ReviewPage } from '../features/review/ReviewPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { ExerciseRunner } from '../features/exercises/ExerciseRunner'
import type { Exercise } from '../domain/types'
import { settingsRepository } from '../storage/settingsRepository'
import { AppPage, routeLabels } from './routes'

export function App() {
  const [page, setPage] = useState<AppPage>('home')
  const [activeExercise, setActiveExercise] = useState<Exercise>()
  const [exerciseResult, setExerciseResult] = useState<{ exerciseId: string; durationMinutes: number; intensityAfter?: number }>()
  const [exerciseExitVersion, setExerciseExitVersion] = useState(0)
  const [refreshToken, setRefreshToken] = useState(0)
  const [onboarding, setOnboarding] = useState<'loading' | 'shown' | 'done'>('loading')
  useEffect(() => { void settingsRepository.get().then((settings) => setOnboarding(settings.onboardingCompleted ? 'done' : 'shown')).catch(() => setOnboarding('done')) }, [])
  async function completeOnboarding() { await settingsRepository.update({ onboardingCompleted: true }); setOnboarding('done') }
  function leaveEntry() {
    setActiveExercise(undefined)
    setExerciseResult(undefined)
    setExerciseExitVersion((value) => value + 1)
    setPage('home')
  }
  function startEntry() {
    setActiveExercise(undefined)
    setExerciseResult(undefined)
    setExerciseExitVersion((value) => value + 1)
    setPage('entry')
  }
  const navigate = (nextPage: AppPage) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setActiveExercise(undefined)
    setExerciseResult(undefined)
    setExerciseExitVersion((value) => value + 1)
    setPage(nextPage)
  }

  return (
    <div className="app-shell">
      {page === 'home' && <HomePage key={refreshToken} onRecord={startEntry} onReview={() => setPage('review')} onExercises={() => setPage('exercises')} onSettings={() => setPage('settings')} />}
      {page === 'entry' && <main className="app-content"><button type="button" className="text-action" onClick={leaveEntry}>返回首页</button><div hidden={Boolean(activeExercise)}><EntryFlow exerciseExitVersion={exerciseExitVersion} exerciseResult={exerciseResult} onSaved={leaveEntry} onExerciseSelect={(exercise) => { setExerciseResult(undefined); setActiveExercise(exercise) }} /></div>{activeExercise && <ExerciseRunner exercise={activeExercise} onExit={() => { setActiveExercise(undefined); setExerciseResult(undefined); setExerciseExitVersion((value) => value + 1) }} onComplete={(result) => { setExerciseResult({ exerciseId: activeExercise.id, ...result }); setActiveExercise(undefined) }} />}</main>}
      {page === 'exercises' && <main className="app-content">{activeExercise ? <ExerciseRunner exercise={activeExercise} onExit={() => setActiveExercise(undefined)} onComplete={() => setActiveExercise(undefined)} /> : <ExerciseLibrary onSelect={setActiveExercise} />}</main>}
      {page === 'review' && <ReviewPage key={refreshToken} onBack={() => setPage('home')} />}
      {page === 'settings' && <SettingsPage onCleared={() => setRefreshToken((value) => value + 1)} />}
      <nav className="bottom-nav" data-mobile-layout="fit-five-items" aria-label="主要导航">
        {(Object.keys(routeLabels) as AppPage[]).map((route) => <a key={route} className="nav-touch-target" data-min-touch-target="44px" href={`#${route}`} onClick={navigate(route)} aria-current={page === route ? 'page' : undefined}>{routeLabels[route]}</a>)}
      </nav>
      {onboarding === 'shown' && <section className="privacy-notice" role="dialog" aria-labelledby="privacy-notice-title"><h2 id="privacy-notice-title">这是你的本机空间</h2><p>记录只保存在这台设备的浏览器中，不上传、不需要账号。你可以跳过说明，之后也能在设置中查看隐私信息。</p><button type="button" onClick={() => void completeOnboarding()}>知道了</button><button type="button" onClick={() => void completeOnboarding()}>跳过</button></section>}
    </div>
  )
}
