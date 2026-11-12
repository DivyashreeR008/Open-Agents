import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SettingsPage from './SettingsPage'

const { clearAutomationKeys } = vi.hoisted(() => ({ clearAutomationKeys: vi.fn() }))

vi.mock('../lib/automationsService', () => ({ clearAutomationKeys }))

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  clearAutomationKeys.mockReset()
  clearAutomationKeys.mockResolvedValue(0)
})

describe('Settings save with every provider filled', () => {
  it('omits the skipped-fields sentence when no field is empty', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('OpenAI API key'), { target: { value: 'sk-openai' } })
    fireEvent.change(screen.getByLabelText('Anthropic API key'), {
      target: { value: 'sk-anthropic' },
    })
    fireEvent.change(screen.getByLabelText('Google Gemini API key'), {
      target: { value: 'sk-gemini' },
    })
    fireEvent.change(screen.getByLabelText('OpenRouter API key'), {
      target: { value: 'sk-openrouter' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save Keys' }))

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Saved keys for OpenAI, Anthropic, Google Gemini, OpenRouter.')
    expect(status).not.toHaveTextContent(/Skipped empty fields/)
  })
})
