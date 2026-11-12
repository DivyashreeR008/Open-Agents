import { beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useHistory } from './useHistory'

beforeEach(() => localStorage.clear())

describe('useHistory output truncation', () => {
  it('keeps the newest run while shortening an oversized output', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.saveRun({
        agentId: 'a1',
        agentName: 'Writer',
        output: 'x'.repeat(20001),
      })
    })

    const saved = result.current.history[0]
    expect(saved.output.length).toBeGreaterThan(20000)
    expect(
      saved.output.endsWith(
        '[Output truncated in history to keep it within the local storage limit.]'
      )
    ).toBe(true)
  })
})
