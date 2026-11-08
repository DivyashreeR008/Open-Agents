import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

const pwa = vi.hoisted(() => ({
  updateAvailable: true,
  applyUpdate: vi.fn(),
  dismiss: vi.fn(),
  waitingWorker: {},
}))

vi.mock('../lib/usePwaUpdate', () => ({ usePwaUpdate: () => pwa }))

import UpdateNotification from './UpdateNotification'

describe('UpdateNotification hook fallbacks', () => {
  it('uses the PWA hook actions when no callbacks are supplied', () => {
    render(<UpdateNotification />)

    fireEvent.click(screen.getByRole('button', { name: 'Reload and apply update' }))
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss update notification' }))

    expect(pwa.applyUpdate).toHaveBeenCalledTimes(1)
    expect(pwa.dismiss).toHaveBeenCalledTimes(1)
  })
})
