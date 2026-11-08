import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useDialogFocus } from './useDialogFocus'

function Dialog({ active, onClose }) {
  const panelRef = useRef(null)
  useDialogFocus(panelRef, { active, onClose })
  return (
    <div ref={panelRef} role="dialog" aria-label="Test dialog">
      <button type="button">Inside</button>
    </div>
  )
}

describe('useDialogFocus inactive mode', () => {
  it('leaves focus and keyboard handling untouched until activated', () => {
    const onClose = vi.fn()
    const opener = document.createElement('button')
    opener.textContent = 'Open'
    document.body.appendChild(opener)
    opener.focus()

    const { rerender } = render(<Dialog active={false} onClose={onClose} />)

    expect(opener).toHaveFocus()
    expect(screen.getByRole('dialog')).not.toHaveAttribute('tabindex')
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()

    rerender(<Dialog active onClose={onClose} />)
    expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)

    opener.remove()
  })
})
