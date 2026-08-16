import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { exercises } from '../../content/exercises'
import type { StressEntry } from '../../domain/types'
import { ExerciseLibrary } from './ExerciseLibrary'
import { ExerciseRunner } from './ExerciseRunner'

describe('ExerciseLibrary', () => {
  afterEach(cleanup)
  it('filters exercises by category and duration and explains an empty result', async () => {
    render(<ExerciseLibrary exercises={exercises} />)

    fireEvent.change(screen.getByLabelText('练习类别'), { target: { value: 'thought' } })
    fireEvent.change(screen.getByLabelText('时长'), { target: { value: '1' } })

    expect(screen.getByText('换个筛选条件')).toBeInTheDocument()
  })
})

describe('ExerciseRunner', () => {
  afterEach(() => { cleanup(); vi.useRealTimers() })
  const exercise = exercises[0]
  const draft: StressEntry = {
    id: 'draft-1', createdAt: '2026-08-17T00:00:00.000Z', intensityBefore: 7,
    primaryEmotions: [], secondaryReactions: [], bodySignals: [], behaviorUrges: [],
  }

  it('pauses and continues its countdown', () => {
    vi.useFakeTimers()
    render(<ExerciseRunner exercise={exercise} />)

    fireEvent.click(screen.getByRole('button', { name: '开始练习' }))
    expect(screen.getByText(`${exercise.durationMinutes}:00`)).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText(`${exercise.durationMinutes - 1}:59`)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '暂停' }))
    act(() => { vi.advanceTimersByTime(2000) })
    expect(screen.getByText(`${exercise.durationMinutes - 1}:59`)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '继续' }))
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText(`${exercise.durationMinutes - 1}:58`)).toBeInTheDocument()
  })

  it('exits without changing the draft and completes with optional intensity', () => {
    const onExit = vi.fn()
    const onComplete = vi.fn()
    render(<ExerciseRunner exercise={exercise} draft={draft} onExit={onExit} onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: '开始练习' }))
    fireEvent.click(screen.getByRole('button', { name: '退出' }))
    expect(onExit).toHaveBeenCalledWith(draft)

    cleanup()
    render(<ExerciseRunner exercise={exercise} onComplete={onComplete} />)
    fireEvent.click(screen.getByRole('button', { name: '开始练习' }))
    fireEvent.change(screen.getByLabelText('练习后强度'), { target: { value: '4' } })
    fireEvent.click(screen.getByRole('button', { name: '完成练习' }))
    expect(onComplete).toHaveBeenCalledWith({ durationMinutes: exercise.durationMinutes, intensityAfter: 4 })
  })

  it('can complete without a post-exercise intensity', () => {
    const onComplete = vi.fn()
    render(<ExerciseRunner exercise={exercise} onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: '开始练习' }))
    fireEvent.click(screen.getByRole('button', { name: '完成练习' }))
    expect(onComplete).toHaveBeenCalledWith({ durationMinutes: exercise.durationMinutes })
  })

  it('rejects a non-integer post-exercise intensity', () => {
    const onComplete = vi.fn()
    render(<ExerciseRunner exercise={exercise} onComplete={onComplete} />)

    fireEvent.change(screen.getByLabelText('练习后强度'), { target: { value: '4.5' } })
    fireEvent.click(screen.getByRole('button', { name: '完成练习' }))

    expect(onComplete).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent('1 到 10 的整数')
  })
})
