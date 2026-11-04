import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SettingsPage from './SettingsPage'
import { getGlobalKeys, saveGlobalKeys } from '../lib/globalKeys'

const { clearAutomationKeys } = vi.hoisted(() => ({
  clearAutomationKeys: vi.fn(),
}))

vi.mock('../lib/automationsService', () => ({ clearAutomationKeys }))

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
  clearAutomationKeys.mockReset()
  clearAutomationKeys.mockResolvedValue(0)
})

describe('Settings credential state', () => {
  it('does not claim success when every field was empty', () => {
    renderSettings()

    fireEvent.click(screen.getByRole('button', { name: 'Save Keys' }))

    expect(screen.getByText(/No keys were saved/)).toBeInTheDocument()
    expect(screen.getByText(/Skipped empty fields: OpenAI, Anthropic, Google Gemini, OpenRouter/)).toBeInTheDocument()
    expect(getGlobalKeys().openai).toBe('')
  })

  it('reports the provider that was saved and the fields that were skipped', () => {
    renderSettings()

    fireEvent.change(screen.getByLabelText('OpenAI API key'), {
      target: { value: 'sk-openai-test' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save Keys' }))

    expect(screen.getByText(/Saved keys for OpenAI/)).toBeInTheDocument()
    expect(screen.getByText(/Skipped empty fields: Anthropic, Google Gemini, OpenRouter/)).toBeInTheDocument()
    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(getGlobalKeys().openai).toBe('sk-openai-test')
  })

  it('asks before clearing a single key and allows the action to be cancelled', () => {
    saveGlobalKeys({ openai: 'sk-openai-test' })
    renderSettings()

    fireEvent.click(screen.getByRole('button', { name: 'Clear OpenAI key' }))

    expect(screen.getByRole('button', { name: 'Yes, clear OpenAI key' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel clearing OpenAI key' }))

    expect(screen.queryByRole('button', { name: 'Yes, clear OpenAI key' })).not.toBeInTheDocument()
    expect(getGlobalKeys().openai).toBe('sk-openai-test')
  })

  it('clears the key after the confirmation is accepted', async () => {
    saveGlobalKeys({ openai: 'sk-openai-test' })
    renderSettings()

    fireEvent.click(screen.getByRole('button', { name: 'Clear OpenAI key' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes, clear OpenAI key' }))

    await screen.findByText('Key cleared.')
    expect(getGlobalKeys().openai).toBe('')
    expect(clearAutomationKeys).toHaveBeenCalledWith('openai')
  })

  it('clears the saved default when the empty option is chosen', () => {
    saveGlobalKeys({ openai: 'sk-openai-test', defaultProvider: 'openai' })
    renderSettings()

    fireEvent.change(screen.getByLabelText('Default provider'), {
      target: { value: '' },
    })

    expect(screen.getByText('Default provider cleared.')).toBeInTheDocument()
    expect(getGlobalKeys().defaultProvider).toBe('')
  })

  it('describes the Anthropic destination without promising a free key', () => {
    renderSettings()

    const anthropicLink = screen
      .getAllByRole('link')
      .find((link) => link.href.includes('console.anthropic.com'))

    expect(anthropicLink).toBeDefined()
    expect(anthropicLink.textContent).not.toMatch(/free/i)
  })
})
