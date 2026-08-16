import { MAX_PRIMARY_EMOTIONS, MAX_SECONDARY_REACTIONS, StressEntry, StressEntryInput } from '../domain/types'
import { ENTRIES_STORE, openDatabase, requestToPromise, transactionToPromise } from './db'

export interface EntryListFilter {
  from?: string
  to?: string
}

type ExportFormat = 'json' | 'csv'

function validateEntry(entry: StressEntryInput | StressEntry): void {
  if (!Number.isInteger(entry.intensityBefore) || entry.intensityBefore < 1 || entry.intensityBefore > 10) {
    throw new Error('intensityBefore must be an integer from 1 to 10')
  }
  if (entry.intensityAfter !== undefined &&
      (!Number.isInteger(entry.intensityAfter) || entry.intensityAfter < 1 || entry.intensityAfter > 10)) {
    throw new Error('intensityAfter must be an integer from 1 to 10')
  }
  if (entry.primaryEmotions.length > MAX_PRIMARY_EMOTIONS) {
    throw new Error(`primaryEmotions cannot contain more than ${MAX_PRIMARY_EMOTIONS} items`)
  }
  if (entry.secondaryReactions.length > MAX_SECONDARY_REACTIONS) {
    throw new Error(`secondaryReactions cannot contain more than ${MAX_SECONDARY_REACTIONS} items`)
  }
}

function closeDatabase(database: IDBDatabase): void {
  database.close()
}

async function withDatabase<T>(operation: (database: IDBDatabase) => Promise<T>): Promise<T> {
  const database = await openDatabase()
  try {
    return await operation(database)
  } finally {
    closeDatabase(database)
  }
}

function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join('、') : value == null ? '' : String(value)
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function toCsv(entries: StressEntry[]): string {
  const header = ['日期', '压力前强度', '压力后强度', '原初情绪', '次生反应', '身体反应', '行为冲动', '练习', '备注']
  const rows = entries.map((entry) => [
    entry.createdAt,
    entry.intensityBefore,
    entry.intensityAfter,
    entry.primaryEmotions,
    entry.secondaryReactions,
    entry.bodySignals,
    entry.behaviorUrges,
    entry.exerciseId,
    entry.note,
  ])
  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')
}

async function listEntries(filter?: EntryListFilter): Promise<StressEntry[]> {
  return withDatabase(async (database) => {
    const transaction = database.transaction(ENTRIES_STORE, 'readonly')
    const completion = transactionToPromise(transaction)
    const entries = await requestToPromise<StressEntry[]>(transaction.objectStore(ENTRIES_STORE).getAll())
    await completion
    return entries
      .filter((entry) => (!filter?.from || entry.createdAt >= filter.from) && (!filter?.to || entry.createdAt <= filter.to))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  })
}

export const entriesRepository = {
  list: listEntries,

  async create(input: StressEntryInput): Promise<StressEntry> {
    validateEntry(input)
    const entry: StressEntry = {
      ...input,
      id: input.id ?? crypto.randomUUID(),
      createdAt: input.createdAt ?? new Date().toISOString(),
    }
    return withDatabase(async (database) => {
      const transaction = database.transaction(ENTRIES_STORE, 'readwrite')
      transaction.objectStore(ENTRIES_STORE).put(entry)
      await transactionToPromise(transaction)
      return entry
    })
  },

  async update(entry: StressEntry): Promise<StressEntry> {
    validateEntry(entry)
    return withDatabase(async (database) => {
      const transaction = database.transaction(ENTRIES_STORE, 'readwrite')
      transaction.objectStore(ENTRIES_STORE).put(entry)
      await transactionToPromise(transaction)
      return entry
    })
  },

  async delete(id: string): Promise<void> {
    return withDatabase(async (database) => {
      const transaction = database.transaction(ENTRIES_STORE, 'readwrite')
      transaction.objectStore(ENTRIES_STORE).delete(id)
      await transactionToPromise(transaction)
    })
  },

  async export(format: ExportFormat): Promise<string> {
    const entries = await listEntries()
    if (format === 'json') return JSON.stringify(entries)
    if (format === 'csv') return toCsv(entries)
    throw new Error(`Unsupported export format: ${format}`)
  },
}
