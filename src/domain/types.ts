export const MAX_PRIMARY_EMOTIONS = 2
export const MAX_SECONDARY_REACTIONS = 3

export type ExerciseCategory = 'thought' | 'body' | 'behavior'

export interface StressEntry {
  id: string
  createdAt: string
  intensityBefore: number
  primaryEmotions: string[]
  secondaryReactions: string[]
  bodySignals: string[]
  behaviorUrges: string[]
  exerciseId?: string
  intensityAfter?: number
  note?: string
  durationMinutes?: number
}

export type StressEntryInput = Omit<StressEntry, 'id' | 'createdAt'> & {
  id?: string
  createdAt?: string
}

export interface Exercise {
  id: string
  category: ExerciseCategory
  title: string
  durationMinutes: number
  instructions: string[]
  sourceChapter: string
}

export interface Settings {
  onboardingCompleted: boolean
  reminderEnabled: boolean
  preferredReminderTime?: string
}
