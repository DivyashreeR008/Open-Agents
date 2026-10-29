import { vi } from 'vitest'

/**
 * Helpers for simulating browser storage failures in tests.
 * Call vi.restoreAllMocks() in beforeEach so spies do not leak between tests.
 */

export function quotaExceededError() {
  const error = new Error('The quota has been exceeded.')
  error.name = 'QuotaExceededError'
  return error
}

/** Every setItem throws QuotaExceededError (storage full). */
export function simulateQuotaExceeded() {
  return vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw quotaExceededError()
  })
}

/** Every storage access throws, like storage disabled by policy. */
export function simulateStorageDisabled() {
  const denied = () => {
    throw new DOMException('The operation is insecure.', 'SecurityError')
  }
  return [
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(denied),
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(denied),
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(denied),
  ]
}

/** Fire the event a write from another tab would cause in this tab. */
export function fireStorageEvent(key, newValue) {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }))
}
