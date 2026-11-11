import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const provider = vi.hoisted(() => ({ streamAgent: vi.fn() }))
vi.mock('../lib/llmAdapter', () => ({ streamAgent: provider.streamAgent }))
vi.mock('./ApiKeyBar', () => ({
  default: ({ setApiKey, apiKeyInputRef }) => (
    <>
      <input ref={apiKeyInputRef} aria-label="API key input" />
      <button type="button" onClick={() => setApiKey('sk-test')}>
        Set test key
      </button>
    </>
  ),
}))
vi.mock('./ApiKeyInfo', () => ({ default: () => null }))
vi.mock('./OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))
vi.mock('./VoiceInput', () => ({ default: () => null }))
vi.mock('./RunRating', () => ({ default: () => null }))
vi.mock('./SuggestedChainPills', () => ({ default: () => null }))
vi.mock('./CostEstimator', () => ({ default: () => null }))
vi.mock('./TokenCounter', () => ({ default: () => null }))
vi.mock('./BatchModeRunner', () => ({ default: () => null }))
vi.mock('./AgentPreviewPanel', () => ({ default: () => null }))
vi.mock('./PromptHistoryPanel', () => ({ default: () => null }))
vi.mock('./ScheduleAgentModal', () => ({ default: () => null }))

import AgentRunner from './AgentRunner'

const agent = {
  id: 'key-agent',
  name: 'Key Agent',
  description: 'Tests provider errors',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test.',
  inputs: [
    { id: 'text', label: 'Text', type: 'textarea', required: true, placeholder: 'type here' },
  ],
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  provider.streamAgent.mockReset()
})

describe('AgentRunner provider error rendering', () => {
  it('renders an invalid key message with the provider and detail', async () => {
    provider.streamAgent.mockRejectedValue({
      type: 'invalid_api_key',
      provider: 'anthropic',
      detail: 'key rejected',
    })

    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Set test key' }))
    fireEvent.change(screen.getByPlaceholderText('type here'), { target: { value: 'hello' } })
    fireEvent.click(screen.getByRole('button', { name: /run agent/i }))

    await waitFor(() => {
      expect(screen.getByText('Your Anthropic API key is invalid or expired.')).toBeInTheDocument()
    })
    expect(screen.getByText(/Details: key rejected/)).toBeInTheDocument()
  })

  it('focuses the key field and preserves work when Update API key is used', async () => {
    provider.streamAgent.mockRejectedValue({
      type: 'invalid_api_key',
      provider: 'openai',
      detail: 'key rejected',
    })

    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Set test key' }))
    fireEvent.change(screen.getByPlaceholderText('type here'), { target: { value: 'hello' } })
    fireEvent.click(screen.getByRole('button', { name: /run agent/i }))

    await waitFor(() => {
      expect(screen.getByText('Your OpenAI API key is invalid or expired.')).toBeInTheDocument()
    })

    const keyInput = screen.getByLabelText('API key input')
    expect(keyInput).not.toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: 'Update API key' }))

    expect(keyInput).toHaveFocus()
    expect(screen.getByPlaceholderText('type here')).toHaveValue('hello')
    expect(screen.getByText(/Details: key rejected/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /reload/i })).not.toBeInTheDocument()
  })

  it('retries the preserved prompt after the key is corrected', async () => {
    provider.streamAgent
      .mockRejectedValueOnce({
        type: 'invalid_api_key',
        provider: 'openai',
        detail: 'key rejected',
      })
      .mockResolvedValueOnce({ content: 'Recovered output', duration: 42 })

    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Set test key' }))
    fireEvent.change(screen.getByPlaceholderText('type here'), { target: { value: 'hello' } })
    fireEvent.click(screen.getByRole('button', { name: /run agent/i }))

    await waitFor(() => {
      expect(screen.getByText('Your OpenAI API key is invalid or expired.')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Retry run' }))

    expect(await screen.findByText('Recovered output')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('type here')).toHaveValue('hello')
    expect(provider.streamAgent).toHaveBeenCalledTimes(2)
    expect(provider.streamAgent.mock.calls[1][0]).toMatchObject({
      apiKey: 'sk-test',
      userMessage: expect.stringContaining('hello'),
    })
  })

  it('renders a generic error message from a thrown Error', async () => {
    provider.streamAgent.mockRejectedValue(new Error('Provider unavailable'))

    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Set test key' }))
    fireEvent.change(screen.getByPlaceholderText('type here'), { target: { value: 'hello' } })
    fireEvent.click(screen.getByRole('button', { name: /run agent/i }))

    await waitFor(() => {
      expect(screen.getByText('Provider unavailable')).toBeInTheDocument()
    })
  })
})
