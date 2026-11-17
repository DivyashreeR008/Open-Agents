// @vitest-environment jsdom
import { webcrypto } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function createResettableIndexedDB() {
  const state = { records: new Map(), addCalls: 0, deleteCalls: 0 }

  function makeDatabase() {
    return {
      objectStoreNames: { contains: () => true },
      close: vi.fn(),
      transaction: () => {
        const transaction = { error: null }
        const store = {
          get: (key) => {
            const request = {}
            queueMicrotask(() => {
              request.result = state.records.get(key)
              request.onsuccess?.()
              if (request.result) queueMicrotask(() => transaction.oncomplete?.())
            })
            return request
          },
          add: (record) => {
            state.addCalls += 1
            state.records.set(record.id, record)
            queueMicrotask(() => transaction.oncomplete?.())
          },
          delete: (key) => {
            const request = {}
            state.deleteCalls += 1
            state.records.delete(key)
            queueMicrotask(() => {
              request.onsuccess?.()
              transaction.oncomplete?.()
            })
            return request
          },
        }
        transaction.objectStore = () => store
        return transaction
      },
    }
  }

  return {
    state,
    indexedDB: {
      open: () => {
        const request = {}
        queueMicrotask(() => {
          request.result = makeDatabase()
          request.onsuccess?.()
        })
        return request
      },
    },
  }
}

beforeEach(() => {
  vi.resetModules()
  vi.unstubAllGlobals()
  vi.stubGlobal('crypto', webcrypto)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('automation device key reset', () => {
  it('deletes the stored key and creates a fresh one for the next caller', async () => {
    const fake = createResettableIndexedDB()
    vi.stubGlobal('indexedDB', fake.indexedDB)
    const { getOrCreateDeviceKey, resetDeviceKey } = await import('./automationKeyStore')

    const first = await getOrCreateDeviceKey()
    await resetDeviceKey()
    const second = await getOrCreateDeviceKey()

    expect(second).not.toBe(first)
    expect(fake.state.deleteCalls).toBe(1)
    expect(fake.state.addCalls).toBe(2)
    expect(fake.state.records.get('automation-vault-v2').key).toBe(second)
  })

  it('fails closed with a typed error when secure storage is unavailable', async () => {
    vi.stubGlobal('indexedDB', undefined)
    const { resetDeviceKey } = await import('./automationKeyStore')

    await expect(resetDeviceKey()).rejects.toMatchObject({
      name: 'CredentialProtectionError',
      code: 'KEYSTORE_UNAVAILABLE',
    })
  })
})
