import { useRef } from 'react'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useDialogFocus } from './useDialogFocus'

function Dialog() {
  const panelRef = useRef(null)
  useDialogFocus(panelRef)
  return (
    <div ref={panelRef} role="dialog" aria-label="Filtered dialog">
      <button type="button" hidden>
        Hidden action
      </button>
      <button type="button" aria-hidden="true">
        Decorative action
      </button>
      <button type="button">Visible action</button>
      <button type="button" disabled>
        Disabled action
      </button>
    </div>
  )
}

describe('useDialogFocus focusable filtering', () => {
  it('skips hidden, aria-hidden, and disabled controls when choosing focus targets', () => {
    render(<Dialog />)

    const visible = screen.getByRole('button', { name: 'Visible action' })
    expect(visible).toHaveFocus()

    fireEvent.keyDown(window, { key: 'Tab' })
    expect(visible).toHaveFocus()
  })
})
