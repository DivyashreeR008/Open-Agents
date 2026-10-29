import { useRef, useState } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useDialogFocus } from './useDialogFocus'

function Harness() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open</button>
      <button>Behind</button>
      {open && <Panel onClose={() => setOpen(false)} />}
    </div>
  )
}

function Panel({ onClose }) {
  const ref = useRef(null)
  useDialogFocus(ref, { onClose })
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Test dialog">
      <button onClick={onClose}>Close</button>
      <input aria-label="Name" />
      <button>Save</button>
    </div>
  )
}

describe('useDialogFocus', () => {
  it('moves focus in, traps Tab, closes on Escape and restores focus', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const opener = screen.getByRole('button', { name: 'Open' })
    await user.click(opener)

    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()

    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus()

    fireEvent.keyDown(document.activeElement, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(opener).toHaveFocus()
  })
})
