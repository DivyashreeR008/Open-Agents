import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useHistory } from './useHistory'

describe('useHistory storage quota failure', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('does not expose a run that storage rejected', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })
    const { result } = renderHook(() => useHistory())

    let outcome
    act(() => {
      outcome = result.current.saveRun({
        agentId: 'a1',
        agentName: 'Writer',
        output: 'done',
      })
    })

    expect(outcome).toMatchObject({ ok: false, reason: 'quota' })
    expect(result.current.history).toEqual([])
    expect(localStorage.getItem('OpenAgents_history')).toBeNull()
  })
})
