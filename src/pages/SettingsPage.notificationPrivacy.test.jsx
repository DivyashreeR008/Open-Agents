import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SettingsPage from './SettingsPage'
import { getRunNotificationPrivacy } from '../lib/runNotifications'

vi.mock('../lib/automationsService', () => ({ clearAutomationKeys: vi.fn() }))
const renderSettings = () =>
  render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>
  )

describe('notification privacy setting', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('defaults to private and explains the lock-screen exposure before opting in', () => {
    renderSettings()
    expect(screen.getByLabelText('Notification content')).toHaveValue('private')
    expect(screen.getByLabelText('Notification content')).toHaveAccessibleDescription(
      /lock screens.*cannot detect whether your device is unlocked/
    )
    expect(screen.getByRole('option', { name: /Detailed/ })).toHaveTextContent(
      'may expose private information'
    )
  })

  it('persists an explicit choice and restores it on remount', () => {
    const view = renderSettings()
    fireEvent.change(screen.getByLabelText('Notification content'), {
      target: { value: 'detailed' },
    })
    expect(getRunNotificationPrivacy()).toBe('detailed')
    expect(screen.getByText('Notification preference saved.')).toBeInTheDocument()
    view.unmount()
    renderSettings()
    expect(screen.getByLabelText('Notification content')).toHaveValue('detailed')
    fireEvent.change(screen.getByLabelText('Notification content'), {
      target: { value: 'private' },
    })
    expect(getRunNotificationPrivacy()).toBe('private')
  })

  it('reports a blocked write without falsely opting in', () => {
    renderSettings()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    fireEvent.change(screen.getByLabelText('Notification content'), {
      target: { value: 'detailed' },
    })
    expect(screen.getByLabelText('Notification content')).toHaveValue('private')
    expect(getRunNotificationPrivacy()).toBe('private')
    expect(screen.getByText(/Could not save the notification preference/)).toBeInTheDocument()
  })
})
