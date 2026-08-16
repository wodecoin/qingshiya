import { SETTINGS_STORE, openDatabase, requestToPromise, transactionToPromise } from './db'
import { Settings } from '../domain/types'

const SETTINGS_ID = 'default'
const defaultSettings: Settings = {
  onboardingCompleted: false,
  reminderEnabled: false,
}

export const settingsRepository = {
  async get(): Promise<Settings> {
    const database = await openDatabase()
    try {
      const transaction = database.transaction(SETTINGS_STORE, 'readonly')
      const completion = transactionToPromise(transaction)
      const stored = await requestToPromise<(Settings & { id: string }) | undefined>(
        transaction.objectStore(SETTINGS_STORE).get(SETTINGS_ID),
      )
      await completion
      if (!stored) return { ...defaultSettings }
      const { id: _id, ...settings } = stored
      return settings
    } finally {
      database.close()
    }
  },

  async update(patch: Partial<Settings>): Promise<Settings> {
    const current = await this.get()
    const next = { ...current, ...patch }
    const database = await openDatabase()
    try {
      const transaction = database.transaction(SETTINGS_STORE, 'readwrite')
      transaction.objectStore(SETTINGS_STORE).put({ id: SETTINGS_ID, ...next })
      await transactionToPromise(transaction)
      return next
    } finally {
      database.close()
    }
  },
}
