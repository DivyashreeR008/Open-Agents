import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ApiKeyBar from './ApiKeyBar'
import { MODELS } from '../lib/resolveAgentModel'
import { saveGlobalKeys } from '../lib/globalKeys'

const mocks = vi.hoisted(() => ({ fetchGeminiModels: vi.fn() }))

vi.mock('../lib/llmAdapter', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchGeminiModels: mocks.fetchGeminiModels,
}))

function Harness({
  initialProvider = 'openai',
  initialKey = '',
  initialSave = false,
  agentProvider = 'any',
  onProviderChange,
}) {
  const [provider, setProviderState] = useState(initialProvider)
  const [apiKey, setApiKey] = useState(initialKey)
  const [saveForSession, setSaveForSession] = useState(initialSave)
  const [model, setModel] = useState(MODELS[initialProvider][0].value)

  const changeProvider = (next) => {
    onProviderChange?.(next)
    setProviderState(next)
  }

  return (
    <MemoryRouter>
      <ApiKeyBar
        provider={provider}
        setProvider={changeProvider}
        apiKey={apiKey}
        setApiKey={setApiKey}
        saveForSession={saveForSession}
        setSaveForSession={setSaveForSession}
        agentProvider={agentProvider}
        model={model}
        setModel={setModel}
      />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  mocks.fetchGeminiModels.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('ApiKeyBar key visibility and session policy', () => {
  it('toggles key visibility and clears session saving when the key is emptied', async () => {
    const user = userEvent.setup()
    render(<Harness initialKey="sk-live" initialSave />)

    const input = screen.getByLabelText('API key')
    expect(input).toHaveAttribute('type', 'password')
    expect(screen.queryByText('Enter an API key to run this agent.')).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Show key' }))
    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide key' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Hide key' }))
    expect(input).toHaveAttribute('type', 'password')

    const save = screen.getByRole('checkbox', { name: /Save for session/i })
    expect(save).toBeChecked()
    await user.clear(input)

    expect(input).toHaveValue('')
    expect(save).not.toBeChecked()
    expect(save).toBeDisabled()
    expect(screen.getByText('Enter an API key to run this agent.')).toBeInTheDocument()
  })
})

describe('ApiKeyBar saved providers and shortcuts', () => {
  it('applies a saved default provider, fills its key, and switches provider by shortcut', async () => {
    const user = userEvent.setup()
    const onProviderChange = vi.fn()
    saveGlobalKeys({ anthropic: 'sk-ant', defaultProvider: 'anthropic' })

    render(<Harness onProviderChange={onProviderChange} />)

    const input = screen.getByLabelText('API key')
    await waitFor(() => expect(input).toHaveValue('sk-ant'))

    const providerTrigger = screen.getByRole('button', { name: 'Provider' })
    expect(providerTrigger).toHaveTextContent('Anthropic')
    expect(screen.getByTitle('Key saved globally')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: '4', altKey: true })

    await waitFor(() => expect(providerTrigger).toHaveTextContent('OpenRouter'))
    expect(onProviderChange).toHaveBeenCalledWith('openrouter')
  })

  it('does not switch to a provider the agent forbids', async () => {
    const user = userEvent.setup()
    const onProviderChange = vi.fn()
    render(<Harness agentProvider="openai" onProviderChange={onProviderChange} />)

    fireEvent.keyDown(window, { key: '2', altKey: true })
    fireEvent.keyDown(window, { key: '3', altKey: true })

    expect(onProviderChange).not.toHaveBeenCalled()
    const providerTrigger = screen.getByRole('button', { name: 'Provider' })
    expect(providerTrigger).toHaveTextContent('OpenAI')

    await user.click(providerTrigger)
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option', { name: /OpenAI/ })).toBeInTheDocument()
  })
})

describe('ApiKeyBar Gemini model loading', () => {
  it('debounces model loading, cancels on unmount, and surfaces fetch failures', async () => {
    const first = render(<Harness initialProvider="gemini" initialKey="gm-key" />)
    expect(mocks.fetchGeminiModels).not.toHaveBeenCalled()

    first.unmount()
    await new Promise((resolve) => setTimeout(resolve, 450))
    expect(mocks.fetchGeminiModels).not.toHaveBeenCalled()

    mocks.fetchGeminiModels.mockResolvedValue([{ value: 'gemini-custom', label: 'Gemini Custom' }])
    const second = render(<Harness initialProvider="gemini" initialKey="gm-key" />)

    await waitFor(() => expect(mocks.fetchGeminiModels).toHaveBeenCalledWith('gm-key'), {
      timeout: 2000,
    })
    const modelTrigger = screen.getByRole('button', { name: 'Model' })
    await waitFor(() => expect(modelTrigger).toHaveTextContent('Gemini Custom'))

    second.unmount()
    mocks.fetchGeminiModels.mockRejectedValue(new Error('bad key'))
    render(<Harness initialProvider="gemini" initialKey="gm-bad" />)

    expect(
      await screen.findByText(
        'Could not load Gemini models. Check your API key.',
        {},
        { timeout: 2000 }
      )
    ).toBeInTheDocument()
  })
})
