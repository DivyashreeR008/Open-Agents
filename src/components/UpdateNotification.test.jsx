import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import UpdateNotification from './UpdateNotification'

describe('UpdateNotification Component', () => {
  it('does not render when updateAvailable is false', () => {
    const { container } = render(<UpdateNotification updateAvailable={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders notification banner with accessible role and message when update is available', () => {
    render(<UpdateNotification updateAvailable={true} />)

    const alert = screen.getByRole('status')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByText('Update Available')).toBeInTheDocument()
    expect(screen.getByText('A new version of Open Agents is ready.')).toBeInTheDocument()
  })

  it('triggers onUpdate callback when Update button is clicked', () => {
    const handleUpdate = vi.fn()
    render(<UpdateNotification updateAvailable={true} onUpdate={handleUpdate} />)

    const updateBtn = screen.getByRole('button', {
      name: /reload and apply update/i,
    })
    fireEvent.click(updateBtn)
    expect(handleUpdate).toHaveBeenCalledTimes(1)
  })

  it('triggers onDismiss callback when Dismiss button is clicked', () => {
    const handleDismiss = vi.fn()
    render(<UpdateNotification updateAvailable={true} onDismiss={handleDismiss} />)

    const dismissBtn = screen.getByRole('button', {
      name: /dismiss update notification/i,
    })
    fireEvent.click(dismissBtn)
    expect(handleDismiss).toHaveBeenCalledTimes(1)
  })
})
