import { afterEach, describe, expect, it, vi } from 'vitest'
import { saveAutomations, saveRuns } from './automationsService'

describe('automation save blocked storage', () => {
  afterEach(() => vi.restoreAllMocks())

  it('does not throw when durable storage rejects both writes', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(() => saveAutomations([])).not.toThrow()
    expect(() => saveRuns([])).not.toThrow()
  })
})
