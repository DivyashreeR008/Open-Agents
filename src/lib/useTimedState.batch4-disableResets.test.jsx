import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTimedState } from './useTimedState'

describe('timed state disabled transitions', () => {
  it('clears a visible value when disabled and ignores updates until enabled again', () => {
    const { result, rerender } = renderHook(({ enabled }) => useTimedState('idle', enabled), {
      initialProps: { enabled: true },
    })

    act(() => result.current[1]('copied', 0))
    expect(result.current[0]).toBe('copied')

    rerender({ enabled: false })
    expect(result.current[0]).toBe('idle')

    act(() => result.current[1]('ignored', 0))
    expect(result.current[0]).toBe('idle')

    rerender({ enabled: true })
    act(() => result.current[1]('again', 0))
    expect(result.current[0]).toBe('again')
  })
})
