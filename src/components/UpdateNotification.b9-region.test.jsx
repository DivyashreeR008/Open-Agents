import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'

vi.mock('../lib/usePwaUpdate', () => ({
  usePwaUpdate: () => ({
    updateAvailable: false,
    applyUpdate: vi.fn(),
    dismiss: vi.fn(),
  }),
}))

import UpdateNotification from './UpdateNotification'

describe('UpdateNotification live region structure', () => {
  it('keeps interactive controls outside the polite status region', () => {
    render(<UpdateNotification updateAvailable onUpdate={vi.fn()} onDismiss={vi.fn()} />)

    const region = screen.getByRole('region', { name: 'Application update available' })
    const status = screen.getByRole('status')

    expect(region).toContainElement(status)
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(within(status).queryByRole('button')).not.toBeInTheDocument()
    expect(
      within(region).getByRole('button', { name: /reload and apply update/i })
    ).toBeInTheDocument()
  })
})
