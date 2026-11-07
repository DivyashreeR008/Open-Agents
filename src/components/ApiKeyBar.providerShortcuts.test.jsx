import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ApiKeyBar from './ApiKeyBar'
import { MODELS } from '../lib/resolveAgentModel'

vi.mock('../lib/llmAdapter', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchGeminiModels: vi.fn().mockResolvedValue([]),
}))

function Harness({ initialProvider = 'openrouter', initialKey = 'sk-test' }) {
  const [provider, setProvider] = useState(initialProvider)
  const [apiKey, setApiKey] = useState(initialKey)
  const [saveForSession, setSaveForSession] = useState(false)
  const [model, setModel] = useState(MODELS[initialProvider][0].value)

  return (
    <MemoryRouter>
      <ApiKeyBar
        provider={provider}
        setProvider={setProvider}
        apiKey={apiKey}
        setApiKey={setApiKey}
        saveForSession={saveForSession}
        setSaveForSession={setSaveForSession}
        agentProvider="any"
        model={model}
        setModel={setModel}
      />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('ApiKeyBar direct provider shortcuts and save toggle', () => {
  it('switches to OpenAI, Anthropic, and Gemini with the number shortcuts', async () => {
    render(<Harness />)
    const trigger = screen.getByRole('button', { name: 'Provider' })

    fireEvent.keyDown(window, { key: '1', altKey: true })
    await waitFor(() => expect(trigger).toHaveTextContent('OpenAI'))

    fireEvent.keyDown(window, { key: '2', altKey: true })
    await waitFor(() => expect(trigger).toHaveTextContent('Anthropic'))

    fireEvent.keyDown(window, { key: '3', altKey: true })
    await waitFor(() => expect(trigger).toHaveTextContent('Gemini'))
  })

  it('checks and unchecks the session storage consent box for a non-empty key', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const save = screen.getByRole('checkbox', { name: /Save for session/i })

    expect(save).not.toBeChecked()
    await user.click(save)
    expect(save).toBeChecked()
    await user.click(save)
    expect(save).not.toBeChecked()
  })
})
