import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SettingsPage from './SettingsPage'
import { saveGlobalKeys } from '../lib/globalKeys'

const { clearAutomationKeys } = vi.hoisted(() => ({ clearAutomationKeys: vi.fn() }))

vi.mock('../lib/automationsService', () => ({ clearAutomationKeys }))

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  clearAutomationKeys.mockReset()
  clearAutomationKeys.mockResolvedValue(1)
})

describe('Settings clear-all singular scheduled job', () => {
  it('uses singular copy when clearing all keys clears one scheduled job', async () => {
    saveGlobalKeys({ openai: 'sk-openai', anthropic: 'sk-anthropic' })
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Clear All Keys' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes, clear all' }))

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'All saved keys and 1 scheduled job copy cleared.'
      )
    )
  })
})
