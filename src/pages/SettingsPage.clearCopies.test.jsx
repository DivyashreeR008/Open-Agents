import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  saveGlobalKeys: vi.fn(),
  actualSaveGlobalKeys: null,
  clearAutomationKeys: vi.fn(),
}))

vi.mock('../lib/globalKeys', async (importOriginal) => {
  const actual = await importOriginal()
  mocks.actualSaveGlobalKeys = actual.saveGlobalKeys
  return { ...actual, saveGlobalKeys: (...args) => mocks.saveGlobalKeys(...args) }
})
vi.mock('../lib/automationsService', () => ({ clearAutomationKeys: mocks.clearAutomationKeys }))

import SettingsPage from './SettingsPage'

function renderSettings() {
  return render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.clearAllMocks()
  mocks.saveGlobalKeys.mockImplementation((...args) => mocks.actualSaveGlobalKeys(...args))
  mocks.clearAutomationKeys.mockResolvedValue(0)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('Settings clear feedback with several scheduled jobs', () => {
  it('uses plural copy when clearing one key also clears several scheduled jobs', async () => {
    mocks.actualSaveGlobalKeys({ openai: 'sk-openai' })
    mocks.clearAutomationKeys.mockResolvedValue(3)
    renderSettings()

    fireEvent.click(screen.getByRole('button', { name: 'Clear OpenAI key' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes, clear OpenAI key' }))

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'Key and 3 scheduled job copies cleared.'
      )
    )
  })

  it('uses plural copy when clearing all keys also clears several scheduled jobs', async () => {
    mocks.actualSaveGlobalKeys({ openai: 'sk-openai', anthropic: 'sk-anthropic' })
    mocks.clearAutomationKeys.mockResolvedValue(2)
    renderSettings()

    fireEvent.click(screen.getByRole('button', { name: 'Clear All Keys' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes, clear all' }))

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'All saved keys and 2 scheduled job copies cleared.'
      )
    )
  })
})
