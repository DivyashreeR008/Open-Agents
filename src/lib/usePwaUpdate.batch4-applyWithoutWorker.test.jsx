import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePwaUpdate } from './usePwaUpdate'

describe('PWA update without a waiting worker', () => {
  afterEach(() => vi.restoreAllMocks())

  it('falls back to a page reload when applyUpdate has no worker', () => {
    const reload = vi.fn()
    const original = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...original, reload },
    })

    const { result } = renderHook(() => usePwaUpdate())
    act(() => result.current.applyUpdate())

    expect(reload).toHaveBeenCalledTimes(1)
    expect(result.current.waitingWorker).toBeNull()

    Object.defineProperty(window, 'location', { configurable: true, value: original })
  })
})
