import { beforeEach, describe, expect, it } from 'vitest'
import { clearAllGlobalKeys, saveGlobalKeys } from './globalKeys'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  clearAllGlobalKeys()
})

describe('saveGlobalKeys whitespace default provider', () => {
  it('clears the stored preference when the default is only whitespace', () => {
    localStorage.setItem('OpenAgents_default_provider', 'openai')

    const result = saveGlobalKeys({ defaultProvider: '   ' })

    expect(result).toMatchObject({ defaultProvider: '', defaultProviderFailed: false })
    expect(localStorage.getItem('OpenAgents_default_provider')).toBeNull()
  })
})
