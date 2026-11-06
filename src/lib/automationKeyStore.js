const DATABASE_NAME = 'open-agents-secure-keystore'
const DATABASE_VERSION = 1
const STORE_NAME = 'crypto-keys'
const DEVICE_KEY_ID = 'automation-vault-v2'

export class CredentialProtectionError extends Error {
  constructor(code, message, cause) {
    super(message, cause ? { cause } : undefined)
    this.name = 'CredentialProtectionError'
    this.code = code
  }
}

function requireProtectionApis() {
  if (!globalThis.crypto?.subtle || typeof globalThis.crypto.getRandomValues !== 'function') {
    throw new CredentialProtectionError(
      'CRYPTO_UNAVAILABLE',
      'Secure browser encryption is unavailable. This automation key was not saved.'
    )
  }
  if (!globalThis.indexedDB) {
    throw new CredentialProtectionError(
      'KEYSTORE_UNAVAILABLE',
      'Secure device storage is unavailable. This automation key was not saved.'
    )
  }
}

function openDatabase() {
  requireProtectionApis()
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(
        new CredentialProtectionError(
          'KEYSTORE_UNAVAILABLE',
          'Secure device storage could not be opened. This automation key was not saved.',
          request.error
        )
      )
    request.onblocked = () =>
      reject(
        new CredentialProtectionError(
          'KEYSTORE_BLOCKED',
          'Secure device storage is blocked by another tab. Close other tabs and try again.'
        )
      )
  })
}

async function createOrReadKey() {
  requireProtectionApis()
  const candidate = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ])
  const database = await openDatabase()

  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(DEVICE_KEY_ID)
      let resolvedKey

      request.onsuccess = () => {
        if (request.result?.key) {
          resolvedKey = request.result.key
        } else {
          store.add({ id: DEVICE_KEY_ID, key: candidate })
          resolvedKey = candidate
        }
      }
      request.onerror = () => reject(request.error)
      transaction.oncomplete = () => resolve(resolvedKey)
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error)
    })
  } catch (error) {
    throw new CredentialProtectionError(
      'KEYSTORE_WRITE_FAILED',
      'A device encryption key could not be stored. This automation key was not saved.',
      error
    )
  } finally {
    database.close()
  }
}

let cachedDeviceKeyPromise

export function getOrCreateDeviceKey() {
  if (!cachedDeviceKeyPromise) {
    cachedDeviceKeyPromise = createOrReadKey().catch((error) => {
      cachedDeviceKeyPromise = undefined
      throw error
    })
  }
  return cachedDeviceKeyPromise
}
