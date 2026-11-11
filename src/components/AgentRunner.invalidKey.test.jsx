import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const provider = vi.hoisted(() => ({ streamAgent: vi.fn() }))
vi.mock('../lib/llmAdapter', () => ({ streamAgent: provider.streamAgent }))
vi.mock('./ApiKeyBar', () => ({
  default: ({ setApiKey }) => (
    <button type="button" onClick={() => setApiKey('sk-test')}>
      Set test key
    </button>
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

const storedHistory = () => JSON.parse(localStorage.getItem('OpenAgents_history') || '[]')

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
    await waitFor(() => expect(storedHistory()).toHaveLength(1))
    expect(storedHistory()[0]).toMatchObject({
      agentId: 'key-agent',
      agentName: 'Key Agent',
      inputs: { text: 'hello' },
      output: '',
      error: 'The provider rejected the API key.',
      status: 'failed',
      provider: 'openai',
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
    await waitFor(() => expect(storedHistory()).toHaveLength(1))
    expect(storedHistory()[0]).toMatchObject({
      agentId: 'key-agent',
      inputs: { text: 'hello' },
      output: '',
      error: 'Provider unavailable',
      status: 'failed',
    })
  })
})
