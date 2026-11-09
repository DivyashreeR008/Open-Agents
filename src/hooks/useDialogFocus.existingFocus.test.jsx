import { createElement, useRef, useState } from 'react'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useDialogFocus } from './useDialogFocus'

function Panel({ active }) {
  const ref = useRef(null)
  useDialogFocus(ref, { active })

  return createElement(
    'div',
    { ref, role: 'dialog', 'aria-label': 'Existing focus dialog', tabIndex: -1 },
    createElement('button', null, 'Inside')
  )
}

function Harness() {
  const [active, setActive] = useState(false)

  return createElement(
    'div',
    null,
    createElement('button', { onClick: () => setActive(true) }, 'Activate'),
    createElement(Panel, { active })
  )
}

describe('useDialogFocus existing focus', () => {
  it('keeps focus when it already sits inside an active dialog', () => {
    render(createElement(Harness))

    const inside = screen.getByRole('button', { name: 'Inside' })
    const dialog = screen.getByRole('dialog')
    inside.focus()
    expect(inside).toHaveFocus()

    fireEvent.click(screen.getByRole('button', { name: 'Activate' }))

    expect(inside).toHaveFocus()
    expect(dialog).toHaveAttribute('tabindex', '-1')
  })
})
