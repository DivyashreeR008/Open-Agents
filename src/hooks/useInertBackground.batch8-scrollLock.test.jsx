import { useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { useInertBackground } from './useInertBackground'
import { useDialogFocus } from './useDialogFocus'

function LockHarness({ label = 'Dialog' }) {
  const panelRef = useRef(null)
  useInertBackground(panelRef)
  return (
    <section ref={panelRef} aria-label={label}>
      <button type="button">{label} action</button>
    </section>
  )
}

function FocusLockHarness({ label = 'Focus dialog' }) {
  const panelRef = useRef(null)
  useDialogFocus(panelRef, { onClose: () => {} })
  return (
    <section ref={panelRef} aria-label={label}>
      <button type="button">{label} action</button>
    </section>
  )
}

beforeEach(() => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
})

afterEach(() => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
})

describe('useInertBackground scroll locking', () => {
  it('stops background scrolling while a dialog is open', () => {
    document.body.style.overflow = 'scroll'

    const { unmount } = render(<LockHarness />)
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('scroll')
  })

  it('keeps the lock until the last nested dialog closes', () => {
    const first = render(<LockHarness label="First" />)
    const second = render(<LockHarness label="Second" />)

    expect(document.body.style.overflow).toBe('hidden')

    first.unmount()
    expect(document.body.style.overflow).toBe('hidden')

    second.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('locks scrolling for dialogs using the shared focus hook', () => {
    const { unmount } = render(<FocusLockHarness />)
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
