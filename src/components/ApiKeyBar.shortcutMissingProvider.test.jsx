import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ApiKeyBar from './ApiKeyBar'

vi.mock('../lib/llmAdapter', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchGeminiModels: vi.fn(),
}))

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('ApiKeyBar shortcuts outside the allowed provider', () => {
  it('ignores OpenAI and OpenRouter shortcuts when the agent requires Anthropic', () => {
    const setProvider = vi.fn()

    render(
      <MemoryRouter>
        <ApiKeyBar
          provider="anthropic"
          setProvider={setProvider}
          apiKey=""
          setApiKey={vi.fn()}
          saveForSession={false}
          setSaveForSession={vi.fn()}
          agentProvider="anthropic"
          model=""
          setModel={vi.fn()}
        />
      </MemoryRouter>
    )

    fireEvent.keyDown(window, { key: '1', altKey: true })
    fireEvent.keyDown(window, { key: '4', altKey: true })

    expect(setProvider).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Provider' })).toHaveTextContent('Anthropic')
  })
})
