import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTimedState } from './useTimedState'

describe('useTimedState disabled surface', () => {
  it('ignores updates until the surface is enabled again', () => {
    const { result, rerender } = renderHook(({ enabled }) => useTimedState('idle', enabled), {
      initialProps: { enabled: false },
    })

    act(() => result.current[1]('copied', 2000))
    expect(result.current[0]).toBe('idle')

    rerender({ enabled: true })
    act(() => result.current[1]('copied', 0))
    expect(result.current[0]).toBe('copied')
  })
})
