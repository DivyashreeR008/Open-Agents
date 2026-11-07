import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useHistory } from './useHistory'

describe('useHistory storage quota failure', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('keeps the new run in memory when persistence throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })
    const { result } = renderHook(() => useHistory())

    act(() => result.current.saveRun({ agentId: 'a1', agentName: 'Writer', output: 'done' }))

    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].agentName).toBe('Writer')
  })
})
