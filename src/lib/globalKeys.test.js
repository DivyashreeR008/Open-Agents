import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearAllGlobalKeys,
  clearGlobalKey,
  getGlobalKeys,
  saveGlobalKeys,
} from './globalKeys'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('saveGlobalKeys', () => {
  it('writes nothing when every field is blank and reports each skipped provider', () => {
    const outcome = saveGlobalKeys({
      openai: '',
      anthropic: '   ',
      gemini: '',
      openrouter: '',
    })

    expect(outcome.stored).toEqual([])
    expect(outcome.skipped).toEqual(['openai', 'anthropic', 'gemini', 'openrouter'])
    expect(getGlobalKeys()).toMatchObject({
      openai: '',
      anthropic: '',
      gemini: '',
      openrouter: '',
    })
  })

  it('stores only populated fields and keeps their ordering for the caller', () => {
    const outcome = saveGlobalKeys({
      openai: ' sk-openai ',
      anthropic: '',
      gemini: 'AIza-test',
      openrouter: '   ',
    })

    expect(outcome.stored).toEqual(['openai', 'gemini'])
    expect(outcome.skipped).toEqual(['anthropic', 'openrouter'])
    expect(getGlobalKeys()).toMatchObject({
      openai: 'sk-openai',
      anthropic: '',
      gemini: 'AIza-test',
      openrouter: '',
    })
  })

  it('clears the saved default when the empty option is selected', () => {
    saveGlobalKeys({ openai: 'sk-openai', defaultProvider: 'openai' })
    expect(getGlobalKeys().defaultProvider).toBe('openai')

    const outcome = saveGlobalKeys({ defaultProvider: '' })

    expect(outcome.defaultProvider).toBe('')
    expect(getGlobalKeys().defaultProvider).toBe('')
    expect(localStorage.getItem('OpenAgents_default_provider')).toBeNull()
  })

  it('leaves the default untouched when the caller omits it', () => {
    saveGlobalKeys({ openai: 'sk-openai', defaultProvider: 'openai' })

    saveGlobalKeys({ gemini: 'AIza-test' })

    expect(getGlobalKeys().defaultProvider).toBe('openai')
  })
})

describe('getGlobalKeys', () => {
  it('drops a default that points at a provider with no live key', () => {
    localStorage.setItem('OpenAgents_default_provider', 'anthropic')

    expect(getGlobalKeys().defaultProvider).toBe('')
    expect(localStorage.getItem('OpenAgents_default_provider')).toBeNull()
  })

  it('returns the stored default while its key exists', () => {
    saveGlobalKeys({ openai: 'sk-openai', defaultProvider: 'openai' })

    expect(getGlobalKeys().defaultProvider).toBe('openai')
  })
})

describe('clearGlobalKey', () => {
  it('removes the key and a default that depended on it', () => {
    saveGlobalKeys({ openai: 'sk-openai', defaultProvider: 'openai' })

    clearGlobalKey('openai')

    expect(getGlobalKeys().openai).toBe('')
    expect(getGlobalKeys().defaultProvider).toBe('')
  })

  it('removes the default directly when asked', () => {
    saveGlobalKeys({ gemini: 'AIza-test', defaultProvider: 'gemini' })

    clearGlobalKey('defaultProvider')

    expect(getGlobalKeys().defaultProvider).toBe('')
    expect(getGlobalKeys().gemini).toBe('AIza-test')
  })

  it('clears every managed key and the default', () => {
    saveGlobalKeys({
      openai: 'sk-openai',
      anthropic: 'sk-ant-test',
      defaultProvider: 'openai',
    })

    clearAllGlobalKeys()

    expect(getGlobalKeys()).toEqual({
      openai: '',
      anthropic: '',
      gemini: '',
      openrouter: '',
      defaultProvider: '',
    })
  })
})
