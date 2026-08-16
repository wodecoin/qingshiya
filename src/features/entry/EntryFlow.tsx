import { useState } from 'react'
import { behaviorUrgeOptions, bodySignalOptions, primaryEmotionOptions, secondaryReactionOptions } from '../../domain/emotionDictionary'
import { MAX_PRIMARY_EMOTIONS, MAX_SECONDARY_REACTIONS } from '../../domain/types'
import { entriesRepository } from '../../storage/entriesRepository'
import { EmotionPicker } from './EmotionPicker'
import { EntrySummary } from './EntrySummary'
import { initialEntryForm, toEntryInput, type EntryFormState } from './entryForm'

interface EntryRepository { create: (input: ReturnType<typeof toEntryInput>) => Promise<unknown> }
interface EntryFlowProps { repository?: EntryRepository; onSaved?: () => void }

const steps = ['intensity', 'primary', 'secondary', 'body', 'behavior', 'exercise'] as const
type Step = typeof steps[number]

export function EntryFlow({ repository = entriesRepository, onSaved }: EntryFlowProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [form, setForm] = useState<EntryFormState>(initialEntryForm)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const step: Step | 'summary' = stepIndex >= steps.length ? 'summary' : steps[stepIndex]
  const highIntensity = form.intensityBefore !== undefined && form.intensityBefore >= 9

  function update(change: Partial<EntryFormState>) { setForm((current) => ({ ...current, ...change })) }

  async function save() {
    setSaving(true)
    setSaveError('')
    try {
      await repository.create(toEntryInput(form))
      setSaved(true)
      onSaved?.()
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : '暂时无法保存，请稍后再试')
    } finally { setSaving(false) }
  }

  if (saved) return <p role="status">记录已保存</p>
  if (step === 'summary') {
    return <EntrySummary entry={toEntryInput(form)} highIntensity={highIntensity} needsImmediateHelp={form.needsImmediateHelp} onNeedsImmediateHelpChange={(value) => update({ needsImmediateHelp: value })} onSave={save} saving={saving} />
  }

  const picker = step === 'primary'
    ? <EmotionPicker options={primaryEmotionOptions} selected={form.primaryEmotions} maxSelections={MAX_PRIMARY_EMOTIONS} onChange={(value) => update({ primaryEmotions: value })} />
    : step === 'secondary'
      ? <EmotionPicker options={secondaryReactionOptions} selected={form.secondaryReactions} maxSelections={MAX_SECONDARY_REACTIONS} onChange={(value) => update({ secondaryReactions: value })} />
      : step === 'body'
        ? <EmotionPicker options={bodySignalOptions} selected={form.bodySignals} onChange={(value) => update({ bodySignals: value })} />
        : <EmotionPicker options={behaviorUrgeOptions} selected={form.behaviorUrges} onChange={(value) => update({ behaviorUrges: value })} />

  return (
    <section aria-labelledby="entry-flow-title">
      <p>第 {stepIndex + 1} 步，共 {steps.length} 步</p>
      {step === 'intensity' && <><h2 id="entry-flow-title">此刻的压力有多强？</h2><div role="group" aria-label="压力强度" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>{Array.from({ length: 10 }, (_, index) => index + 1).map((value) => <button key={value} type="button" aria-pressed={form.intensityBefore === value} onClick={() => update({ intensityBefore: value })}>{value}</button>)}</div>{highIntensity && <p role="note">压力很高，但你仍然可以按自己的节奏记录。</p>}</>}
      {step === 'primary' && <><h2 id="entry-flow-title">最贴近的原初情绪</h2>{picker}</>}
      {step === 'secondary' && <><h2 id="entry-flow-title">还有哪些叠加反应？</h2>{picker}</>}
      {step === 'body' && <><h2 id="entry-flow-title">身体有什么信号？</h2>{picker}</>}
      {step === 'behavior' && <><h2 id="entry-flow-title">此刻有什么行为冲动？</h2>{picker}</>}
      {step === 'exercise' && <><h2 id="entry-flow-title">练习后压力有多强？（可选）</h2><input aria-label="练习后压力强度" type="number" min="1" max="10" value={form.intensityAfter ?? ''} onChange={(event) => update({ intensityAfter: event.target.value ? Number(event.target.value) : undefined })} /></>}
      <footer style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button type="button" onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} disabled={stepIndex === 0}>上一步</button>
        <button type="button" onClick={() => setStepIndex(stepIndex + 1)}>跳过此步</button>
        <button type="button" onClick={() => setStepIndex(stepIndex + 1)}>下一步</button>
        <button type="button" onClick={save} disabled={saving}>保存</button>
      </footer>
      {saveError && <p role="alert">{saveError}</p>}
    </section>
  )
}
