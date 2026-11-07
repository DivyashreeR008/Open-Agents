import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/automationsService', () => ({ clearAutomationKeys: vi.fn() }))

import SettingsPage from './SettingsPage'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('Settings default-provider empty state', () => {
  it('explains that a key is required before a default provider can be chosen', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Save at least one API key above to set a default provider.')
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('Default provider')).not.toBeInTheDocument()
  })
})
