import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useHistory } from './useHistory'

describe('history delete missing run', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('keeps the list intact when the target id is absent', () => {
    const { result } = renderHook(() => useHistory())

    act(() => result.current.saveRun({ agentId: 'agent-1', agentName: 'Agent One', output: 'x' }))
    const before = result.current.history

    act(() => result.current.deleteRun('missing-id'))

    expect(result.current.history).toEqual(before)
    expect(result.current.history).toHaveLength(1)
  })
})
