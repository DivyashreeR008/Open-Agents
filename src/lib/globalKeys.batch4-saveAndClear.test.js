import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { clearGlobalKey, getGlobalKeys, saveGlobalKeys } from './globalKeys'

describe('global key save and clear behavior', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })
  afterEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('skips empty edits, stores trimmed keys, and sets the default provider', () => {
    const result = saveGlobalKeys({
      openai: '  sk-test  ',
      anthropic: '   ',
      defaultProvider: 'openai',
    })

    expect(result).toEqual({
      stored: ['openai'],
      skipped: ['anthropic'],
      defaultProvider: 'openai',
    })
    expect(getGlobalKeys()).toMatchObject({ openai: 'sk-test', defaultProvider: 'openai' })
  })

  it('clears the default when its provider key is removed', () => {
    saveGlobalKeys({ openai: 'sk-test', defaultProvider: 'openai' })
    clearGlobalKey('openai')

    expect(getGlobalKeys()).toMatchObject({ openai: '', defaultProvider: '' })
    expect(localStorage.getItem('OpenAgents_default_provider')).toBeNull()
  })
})
