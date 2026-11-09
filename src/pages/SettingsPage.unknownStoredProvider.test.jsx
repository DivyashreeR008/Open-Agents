import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/globalKeys', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    saveGlobalKeys: () => ({ stored: ['mystery'], skipped: [] }),
  }
})
vi.mock('../lib/automationsService', () => ({ clearAutomationKeys: vi.fn() }))

import SettingsPage from './SettingsPage'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('Settings unknown stored provider label', () => {
  it('falls back to the raw provider id when storage reports an unknown label', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save Keys' }))

    expect(screen.getByRole('status')).toHaveTextContent('Saved keys for mystery.')
  })
})
