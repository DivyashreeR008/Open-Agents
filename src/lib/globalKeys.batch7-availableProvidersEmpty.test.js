import { beforeEach, describe, expect, it } from 'vitest'
import { clearAllGlobalKeys, getAvailableProviders } from './globalKeys'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  clearAllGlobalKeys()
})

describe('getAvailableProviders without saved keys', () => {
  it('returns no providers after all keys are cleared', () => {
    expect(getAvailableProviders()).toEqual([])
  })
})
