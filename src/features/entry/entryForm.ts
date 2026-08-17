import type { StressEntryInput } from '../../domain/types'

export interface EntryFormState {
  id?: string
  createdAt?: string
  intensityBefore?: number
  primaryEmotions: string[]
  secondaryReactions: string[]
  bodySignals: string[]
  behaviorUrges: string[]
  exerciseId?: string
  durationMinutes?: number
  intensityAfter?: number
  note?: string
  needsImmediateHelp: boolean
}

export const initialEntryForm: EntryFormState = {
  primaryEmotions: [],
  secondaryReactions: [],
  bodySignals: [],
  behaviorUrges: [],
  needsImmediateHelp: false,
}

export function toEntryInput(form: EntryFormState): StressEntryInput {
  if (form.intensityBefore === undefined) throw new Error('请选择压力强度')

  return {
    ...(form.id ? { id: form.id } : {}),
    ...(form.createdAt ? { createdAt: form.createdAt } : {}),
    intensityBefore: form.intensityBefore,
    primaryEmotions: form.primaryEmotions,
    secondaryReactions: form.secondaryReactions,
    bodySignals: form.bodySignals,
    behaviorUrges: form.behaviorUrges,
    ...(form.exerciseId ? { exerciseId: form.exerciseId } : {}),
    ...(form.durationMinutes === undefined ? {} : { durationMinutes: form.durationMinutes }),
    ...(form.intensityAfter === undefined ? {} : { intensityAfter: form.intensityAfter }),
    ...(form.note?.trim() ? { note: form.note.trim() } : {}),
  }
}

export function readableValues(values: string[]): string {
  return values.length > 0 ? values.join('、') : '未填写'
}
