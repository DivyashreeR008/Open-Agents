import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useHistory } from './useHistory'

beforeEach(() => localStorage.clear())

describe('useHistory storage shape filtering', () => {
  it('ignores nested arrays and primitives while keeping run objects', () => {
    localStorage.setItem(
      'OpenAgents_history',
      JSON.stringify([[1, 2], null, 'run', { id: 'r1', output: 'kept' }])
    )

    const { result } = renderHook(() => useHistory())

    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].id).toBe('r1')
  })
})
