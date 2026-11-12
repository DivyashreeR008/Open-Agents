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

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent(/No keys were saved/)
    expect(status).toHaveTextContent(
      /Skipped empty fields: OpenAI, Anthropic, Google Gemini, OpenRouter/
    )
    expect(getGlobalKeys().openai).toBe('')
  })

  it('reports the provider that was saved and the fields that were skipped', () => {
    renderSettings()

    fireEvent.change(screen.getByLabelText('OpenAI API key'), {
      target: { value: 'sk-openai-test' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save Keys' }))

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent(/Saved keys for OpenAI/)
    expect(status).toHaveTextContent(/Skipped empty fields: Anthropic, Google Gemini, OpenRouter/)
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

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Key cleared.')
    })
    expect(getGlobalKeys().openai).toBe('')
    expect(clearAutomationKeys).toHaveBeenCalledWith('openai')
  })

  it('clears the saved default when the empty option is chosen', () => {
    saveGlobalKeys({ openai: 'sk-openai-test', defaultProvider: 'openai' })
    renderSettings()

    fireEvent.change(screen.getByLabelText('Default provider'), {
      target: { value: '' },
    })

    expect(screen.getByRole('status')).toHaveTextContent('Default provider cleared.')
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

  it('states the real lifetime and storage boundaries for saved keys', () => {
    renderSettings()

    const privacyNote = screen.getByText(/Saved provider keys last for this tab/)
    expect(privacyNote).toHaveTextContent(/removed after eight hours or when the tab closes/)
    expect(privacyNote).toHaveTextContent(/Scheduled jobs use a separate encrypted vault/)
    expect(privacyNote).toHaveTextContent(/that key is not uploaded/)
    expect(privacyNote).toHaveTextContent(/Automation definitions and saved inputs may sync/)
    expect(privacyNote).toHaveTextContent(/provider keys are not included in that sync/)
    expect(privacyNote).not.toHaveTextContent(/synced copy/i)
    expect(privacyNote).not.toHaveTextContent(/localStorage/i)
  })
})
