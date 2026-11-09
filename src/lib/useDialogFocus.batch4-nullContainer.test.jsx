import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useRef } from 'react'
import { useDialogFocus } from '../hooks/useDialogFocus'

describe('dialog focus null container', () => {
  it('does nothing when the container is not mounted yet', () => {
    const onClose = vi.fn()
    const { unmount } = renderHook(() => {
      const ref = useRef(null)
      useDialogFocus(ref, { active: true, onClose })
      return ref
    })

    expect(() =>
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    ).not.toThrow()
    expect(onClose).not.toHaveBeenCalled()
    unmount()
  })
})
