import { afterEach, describe, expect, it, vi } from 'vitest'
import { clearTraces, loadTraces } from './executionTrace'

describe('execution trace storage failure handling', () => {
  afterEach(() => vi.restoreAllMocks())

  it('returns an empty list when reading storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })

    expect(loadTraces()).toEqual([])
  })

  it('does not throw when clearing storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })

    expect(() => clearTraces()).not.toThrow()
  })
})
