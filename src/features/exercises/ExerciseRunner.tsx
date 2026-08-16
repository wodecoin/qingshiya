import { useEffect, useState } from 'react'
import type { Exercise, StressEntry } from '../../domain/types'
import './exercises.css'

interface ExerciseResult { durationMinutes: number; intensityAfter?: number }
interface ExerciseRunnerProps { exercise: Exercise; draft?: StressEntry; onComplete?: (result: ExerciseResult) => void; onExit?: (draft?: StressEntry) => void }

export function ExerciseRunner({ exercise, draft, onComplete, onExit }: ExerciseRunnerProps) {
  const [remaining, setRemaining] = useState(exercise.durationMinutes * 60)
  const [running, setRunning] = useState(false)
  const [intensityAfter, setIntensityAfter] = useState('')
  const [completedResult, setCompletedResult] = useState<ExerciseResult | undefined>()

  useEffect(() => {
    if (!running || remaining <= 0) return
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [running, remaining])

  const minutes = Math.floor(remaining / 60)
  const seconds = String(remaining % 60).padStart(2, '0')
  function complete() {
    setRunning(false)
    const result = { durationMinutes: exercise.durationMinutes, ...(intensityAfter ? { intensityAfter: Number(intensityAfter) } : {}) }
    setCompletedResult(result)
    onComplete?.(result)
  }

  if (completedResult) {
    const change = draft?.intensityBefore !== undefined && completedResult.intensityAfter !== undefined ? completedResult.intensityAfter - draft.intensityBefore : undefined
    return <div role="status"><p>练习已完成。你可以按自己的节奏继续。</p>{change !== undefined && <p>记录到的变化量：{change > 0 ? `增加 ${change}` : change < 0 ? `减少 ${Math.abs(change)}` : '没有变化'} 分。</p>}</div>
  }
  return <section className="exercise-runner" aria-labelledby="exercise-runner-title">
    <p className="exercise-meta">{exercise.durationMinutes} 分钟 · {exercise.sourceChapter}</p>
    <h2 id="exercise-runner-title">{exercise.title}</h2>
    {exercise.applicableSituations && <p>适用情境：{exercise.applicableSituations.join('；')}</p>}
    <ol>{exercise.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol>
    <p className="exercise-timer" aria-label="剩余时间">{minutes}:{seconds}</p>
    {exercise.exitInstructions && <p className="exercise-exit">退出方式：{exercise.exitInstructions}</p>}
    <label>练习后强度（可选）<input aria-label="练习后强度" type="number" min="1" max="10" value={intensityAfter} onChange={(event) => setIntensityAfter(event.target.value)} /></label>
    <div className="exercise-actions"><button type="button" onClick={() => setRunning(true)} disabled={running}>{running ? '进行中' : '开始练习'}</button><button type="button" onClick={() => setRunning(false)} disabled={!running}>暂停</button><button type="button" onClick={() => setRunning(true)} disabled={running}>继续</button><button type="button" onClick={() => onExit?.(draft)}>退出</button><button type="button" onClick={complete}>完成练习</button></div>
  </section>
}
