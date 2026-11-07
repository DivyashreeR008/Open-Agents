import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import UpdateNotification from './UpdateNotification'

describe('UpdateNotification icon semantics', () => {
  it('keeps both action icons decorative while the buttons stay named', () => {
    const { container } = render(
      <UpdateNotification updateAvailable onUpdate={() => {}} onDismiss={() => {}} />
    )

    const icons = [...container.querySelectorAll('svg')]
    expect(icons).toHaveLength(2)
    for (const icon of icons) expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('button', { name: 'Reload and apply update' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dismiss update notification' })).toBeInTheDocument()
  })
})
