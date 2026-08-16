export const DATABASE_NAME = 'qingshiya'
export const DATABASE_VERSION = 1
export const ENTRIES_STORE = 'entries'
export const SETTINGS_STORE = 'settings'

export function openDatabase(indexedDBFactory: IDBFactory = globalThis.indexedDB): Promise<IDBDatabase> {
  if (!indexedDBFactory) {
    return Promise.reject(new Error('IndexedDB is unavailable in this environment'))
  }

  return new Promise((resolve, reject) => {
    const request = indexedDBFactory.open(DATABASE_NAME, DATABASE_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(ENTRIES_STORE)) {
        database.createObjectStore(ENTRIES_STORE, { keyPath: 'id' })
      }
      if (!database.objectStoreNames.contains(SETTINGS_STORE)) {
        database.createObjectStore(SETTINGS_STORE, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Unable to open IndexedDB'))
    request.onblocked = () => reject(new Error('IndexedDB upgrade is blocked'))
  })
}

export function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
  })
}

export function transactionToPromise(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed'))
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted'))
  })
}
