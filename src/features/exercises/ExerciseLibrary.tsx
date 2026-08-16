import { useState } from 'react'
import type { Exercise, ExerciseCategory } from '../../domain/types'
import { exercises as defaultExercises } from '../../content/exercises'
import './exercises.css'

interface ExerciseLibraryProps { exercises?: Exercise[]; onSelect?: (exercise: Exercise) => void }
const categoryNames: Record<ExerciseCategory, string> = { thought: '思维', body: '身体', behavior: '行为' }

export function ExerciseLibrary({ exercises = defaultExercises, onSelect }: ExerciseLibraryProps) {
  const [category, setCategory] = useState<ExerciseCategory | ''>('')
  const [duration, setDuration] = useState('')
  const filtered = exercises.filter((exercise) => (!category || exercise.category === category) && (!duration || exercise.durationMinutes === Number(duration)))

  return <section className="exercise-library" aria-labelledby="exercise-library-title">
    <h2 id="exercise-library-title">选择一个练习</h2>
    <div className="exercise-filters">
      <label>练习类别<select aria-label="练习类别" value={category} onChange={(event) => setCategory(event.target.value as ExerciseCategory | '')}><option value="">全部类别</option>{Object.entries(categoryNames).map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select></label>
      <label>时长<select aria-label="时长" value={duration} onChange={(event) => setDuration(event.target.value)}><option value="">全部时长</option><option value="1">1 分钟</option><option value="3">3 分钟</option><option value="5">5 分钟</option><option value="10">10 分钟</option></select></label>
    </div>
    {filtered.length === 0 ? <p className="exercise-empty">换个筛选条件</p> : <div className="exercise-list">{filtered.map((exercise) => <article className="exercise-card" key={exercise.id}><p className="exercise-meta">{categoryNames[exercise.category]} · {exercise.durationMinutes} 分钟</p><h3>{exercise.title}</h3><p>{exercise.applicableSituations?.[0]}</p><button type="button" onClick={() => onSelect?.(exercise)}>开始</button></article>)}</div>}
  </section>
}
