import type { StressEntryInput } from '../../domain/types'
import { readableValues } from './entryForm'

interface EntrySummaryProps {
  entry: StressEntryInput
  highIntensity: boolean
  needsImmediateHelp: boolean
  onNeedsImmediateHelpChange: (value: boolean) => void
  onSave: () => void
  saving?: boolean
  saveError?: string
}

export function EntrySummary({ entry, highIntensity, needsImmediateHelp, onNeedsImmediateHelpChange, onSave, saving = false, saveError }: EntrySummaryProps) {
  return (
    <section aria-labelledby="entry-summary-title">
      <h2 id="entry-summary-title">确认这次记录</h2>
      <dl>
        <div><dt>压力强度</dt><dd>压力强度：{entry.intensityBefore}</dd></div>
        <div><dt>原初情绪</dt><dd>{readableValues(entry.primaryEmotions)}</dd></div>
        <div><dt>叠加反应</dt><dd>{readableValues(entry.secondaryReactions)}</dd></div>
        <div><dt>身体信号</dt><dd>{readableValues(entry.bodySignals)}</dd></div>
        <div><dt>行为冲动</dt><dd>{readableValues(entry.behaviorUrges)}</dd></div>
        {entry.intensityAfter !== undefined && <div><dt>练习后强度</dt><dd>{entry.intensityAfter}</dd></div>}
        {entry.note && <div><dt>备注</dt><dd>{entry.note}</dd></div>}
      </dl>
      {highIntensity && (
        <aside role="note">
          <p>压力很高，但你仍然可以按自己的节奏记录。</p>
          <button type="button" aria-pressed={needsImmediateHelp} onClick={() => onNeedsImmediateHelpChange(!needsImmediateHelp)}>
            需要立即帮助
          </button>
          {needsImmediateHelp && <p>请立即联系当地急救服务或身边可信任的人，陪你一起获得支持。</p>}
        </aside>
      )}
      <button type="button" className="primary-action" onClick={onSave} disabled={saving}>
        {saving ? '保存中…' : '保存记录'}
      </button>
      {saveError && <p role="alert">{saveError}</p>}
    </section>
  )
}
