import { fireEvent, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

describe('useKeyboardShortcuts modifier edge cases', () => {
  it('requires every modifier in a Control+Shift binding', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts({ 'Control+Shift+Enter': handler }))

    fireEvent.keyDown(window, { key: 'Enter', ctrlKey: true, shiftKey: true })
    expect(handler).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(window, { key: 'Enter', ctrlKey: true })
    fireEvent.keyDown(window, { key: 'Enter', shiftKey: true })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('fires Alt+Space without treating a bare space as the same shortcut', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts({ 'Alt+Space': handler }))

    fireEvent.keyDown(window, { key: ' ' })
    expect(handler).not.toHaveBeenCalled()

    fireEvent.keyDown(window, { key: ' ', altKey: true })
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
