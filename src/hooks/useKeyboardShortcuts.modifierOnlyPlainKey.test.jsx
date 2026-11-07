import { fireEvent, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

describe('useKeyboardShortcuts plain-key modifier isolation', () => {
  it('does not run a plain slash binding when a command modifier is held', () => {
    const slash = vi.fn()
    renderHook(() => useKeyboardShortcuts({ '/': slash }))

    fireEvent.keyDown(window, { key: '/', ctrlKey: true })
    fireEvent.keyDown(window, { key: '/', metaKey: true })
    fireEvent.keyDown(window, { key: '/', altKey: true })

    expect(slash).not.toHaveBeenCalled()
  })

  it('still runs the plain slash binding without a command modifier', () => {
    const slash = vi.fn()
    renderHook(() => useKeyboardShortcuts({ '/': slash }))

    fireEvent.keyDown(window, { key: '/' })

    expect(slash).toHaveBeenCalledTimes(1)
  })
})
