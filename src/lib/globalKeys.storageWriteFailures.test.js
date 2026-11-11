import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getGlobalKeys, getKeyStorageStatus, saveGlobalKeys } from './globalKeys'
import { simulateQuotaExceeded } from '../test/storageFailures'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.restoreAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  sessionStorage.clear()
})

describe('globalKeys storage write failures', () => {
  it('reports failed provider writes instead of claiming they were stored', () => {
    simulateQuotaExceeded()

    const outcome = saveGlobalKeys({
      openai: 'sk-openai',
      anthropic: 'sk-ant',
      defaultProvider: 'openai',
    })

    expect(outcome.stored).toEqual([])
    expect(outcome.skipped).toEqual([])
    expect(outcome.failed).toEqual(['openai', 'anthropic'])
    expect(outcome.defaultProviderFailed).toBe(true)
    expect(getGlobalKeys()).toMatchObject({
      openai: '',
      anthropic: '',
      defaultProvider: '',
    })
  })

  it('keeps successful keys and reports only the provider whose write failed', () => {
    const originalSetItem = Storage.prototype.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function setItem(key, value) {
      if (this === sessionStorage && key === 'OpenAgents_anthropic_key') {
        throw new Error('QuotaExceededError')
      }
      return originalSetItem.call(this, key, value)
    })

    const outcome = saveGlobalKeys({
      openai: 'sk-openai',
      anthropic: 'sk-ant',
      defaultProvider: 'openai',
    })

    expect(outcome.stored).toEqual(['openai'])
    expect(outcome.failed).toEqual(['anthropic'])
    expect(outcome.defaultProviderFailed).toBe(false)
    expect(getGlobalKeys()).toMatchObject({
      openai: 'sk-openai',
      anthropic: '',
      defaultProvider: 'openai',
    })
  })

  it('detects when storage probes cannot write', () => {
    simulateQuotaExceeded()

    expect(getKeyStorageStatus()).toEqual({
      sessionAvailable: false,
      localAvailable: false,
    })
  })
})
