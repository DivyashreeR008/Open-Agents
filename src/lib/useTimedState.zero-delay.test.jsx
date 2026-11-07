import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTimedState } from './useTimedState'

describe('useTimedState zero delay', () => {
  it('leaves the confirmation in place when the delay is zero', () => {
    const { result } = renderHook(() => useTimedState('idle'))

    act(() => result.current[1]('saved', 0))

    expect(result.current[0]).toBe('saved')
  })
})
