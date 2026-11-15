import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/globalKeys', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    saveGlobalKeys: () => ({ stored: ['openai'] }),
  }
})
vi.mock('../lib/automationsService', () => ({ clearAutomationKeys: vi.fn() }))

import SettingsPage from './SettingsPage'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('SettingsPage incomplete save fields', () => {
  it('handles a key-save return value containing only stored without throwing or failing', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('OpenAI API key'), {
      target: { value: 'sk-test-key' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save Keys' }))

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Saved keys for OpenAI.')
    expect(status).not.toHaveTextContent('Keys could not be saved.')
    expect(status).not.toHaveTextContent('Skipped empty fields')
  })
})
