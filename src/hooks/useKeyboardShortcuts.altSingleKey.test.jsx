import { describe, expect, it, vi } from 'vitest'
import { fireEvent, renderHook } from '@testing-library/react'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

describe('useKeyboardShortcuts modifier guard', () => {
  it('does not fire a single-key shortcut while Alt is held', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts({ k: handler }))

    fireEvent.keyDown(window, { key: 'k', altKey: true })
    expect(handler).not.toHaveBeenCalled()

    fireEvent.keyDown(window, { key: 'k' })
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
