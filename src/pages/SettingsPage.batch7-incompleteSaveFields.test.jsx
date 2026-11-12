import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/globalKeys', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    saveGlobalKeys: () => ({
      stored: ['openai'],
      skipped: undefined,
      failed: undefined,
      defaultProviderFailed: undefined,
    }),
  }
})
vi.mock('../lib/automationsService', () => ({ clearAutomationKeys: vi.fn() }))

import SettingsPage from './SettingsPage'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('SettingsPage incomplete key save return values', () => {
  it('reports saved providers when optional save fields are missing', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save Keys' }))

    expect(screen.getByRole('status')).toHaveTextContent('Saved keys for OpenAI.')
  })
})
