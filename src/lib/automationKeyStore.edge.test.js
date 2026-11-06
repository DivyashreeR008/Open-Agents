// @vitest-environment jsdom
import { webcrypto } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const STORE_NAME = 'crypto-keys'
const DATABASE_NAME = 'open-agents-secure-keystore'
const DEVICE_KEY_ID = 'automation-vault-v2'

function createFakeIndexedDB({ openMode = 'success' } = {}) {
  const state = {
    openMode,
    databases: new Map(),
    records: new Map(),
    addCalls: 0,
    closeCalls: 0,
    failNextAdd: false,
  }

  function createDatabase(hasStore) {
    const stores = new Set(hasStore ? [STORE_NAME] : [])
    let store

    const database = {
      objectStoreNames: {
        contains: (name) => stores.has(name),
      },
      createObjectStore: (name) => {
        stores.add(name)
        return {}
      },
      close: () => {
        state.closeCalls += 1
      },
      transaction: () => {
        const transaction = {
          error: null,
          objectStore: () => store,
        }

        store = {
          get: (key) => {
            const request = {}
            queueMicrotask(() => {
              const existing = state.records.get(key)
              request.result = existing
              request.onsuccess?.()
              if (existing) queueMicrotask(() => transaction.oncomplete?.())
            })
            return request
          },
          add: (record) => {
            state.addCalls += 1
            if (state.failNextAdd) {
              state.failNextAdd = false
              transaction.error = new Error('Quota exceeded')
              queueMicrotask(() => transaction.onerror?.())
              return
            }
            state.records.set(record.id, record)
            queueMicrotask(() => transaction.oncomplete?.())
          },
        }

        return transaction
      },
    }

    return database
  }

  const indexedDB = {
    open: (name) => {
      const request = {}
      queueMicrotask(() => {
        if (state.openMode === 'blocked') {
          request.onblocked?.()
          return
        }
        if (state.openMode === 'error') {
          request.onerror?.()
          return
        }

        const existing = state.databases.get(name)
        const database = existing || createDatabase(false)
        state.databases.set(name, database)
        request.result = database
        if (!existing) request.onupgradeneeded?.()
        request.onsuccess?.()
      })
      return request
    },
  }

  return { indexedDB, state }
}

beforeEach(() => {
  vi.resetModules()
  vi.unstubAllGlobals()
  vi.stubGlobal('crypto', webcrypto)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('automation key store failure recovery', () => {
  it('fails closed without Web Crypto and retries successfully once it is restored', async () => {
    vi.stubGlobal('crypto', undefined)
    const { getOrCreateDeviceKey } = await import('./automationKeyStore')

    await expect(getOrCreateDeviceKey()).rejects.toMatchObject({
      name: 'CredentialProtectionError',
      code: 'CRYPTO_UNAVAILABLE',
    })

    const fake = createFakeIndexedDB()
    vi.stubGlobal('crypto', webcrypto)
    vi.stubGlobal('indexedDB', fake.indexedDB)

    const key = await getOrCreateDeviceKey()
    expect(key.algorithm.name).toBe('AES-GCM')
    expect(fake.state.addCalls).toBe(1)
  })

  it('maps a blocked database to KEYSTORE_BLOCKED and an open failure to KEYSTORE_UNAVAILABLE', async () => {
    const fake = createFakeIndexedDB({ openMode: 'blocked' })
    vi.stubGlobal('indexedDB', fake.indexedDB)
    const { getOrCreateDeviceKey } = await import('./automationKeyStore')

    await expect(getOrCreateDeviceKey()).rejects.toMatchObject({
      name: 'CredentialProtectionError',
      code: 'KEYSTORE_BLOCKED',
    })

    fake.state.openMode = 'error'
    await expect(getOrCreateDeviceKey()).rejects.toMatchObject({
      name: 'CredentialProtectionError',
      code: 'KEYSTORE_UNAVAILABLE',
    })
  })

  it('shares one key between concurrent callers and reuses it from a fresh module', async () => {
    const fake = createFakeIndexedDB()
    vi.stubGlobal('indexedDB', fake.indexedDB)
    const { getOrCreateDeviceKey } = await import('./automationKeyStore')

    const [first, second] = await Promise.all([getOrCreateDeviceKey(), getOrCreateDeviceKey()])

    expect(first).toBe(second)
    expect(first.type).toBe('secret')
    expect(fake.state.addCalls).toBe(1)
    expect(fake.state.closeCalls).toBe(1)

    vi.resetModules()
    const { getOrCreateDeviceKey: freshStore } = await import('./automationKeyStore')
    const reused = await freshStore()

    expect(reused).toBe(first)
    expect(fake.state.addCalls).toBe(1)
    expect(fake.state.closeCalls).toBe(2)
  })

  it('reports a write failure and creates a new key when the caller retries', async () => {
    const fake = createFakeIndexedDB()
    fake.state.failNextAdd = true
    vi.stubGlobal('indexedDB', fake.indexedDB)
    const { getOrCreateDeviceKey } = await import('./automationKeyStore')

    await expect(getOrCreateDeviceKey()).rejects.toMatchObject({
      name: 'CredentialProtectionError',
      code: 'KEYSTORE_WRITE_FAILED',
    })
    expect(fake.state.addCalls).toBe(1)
    expect(fake.state.closeCalls).toBe(1)

    const key = await getOrCreateDeviceKey()

    expect(key.algorithm.name).toBe('AES-GCM')
    expect(fake.state.addCalls).toBe(2)
    expect(fake.state.closeCalls).toBe(2)
    expect(fake.state.records.get(DEVICE_KEY_ID).key).toBe(key)
  })
})
