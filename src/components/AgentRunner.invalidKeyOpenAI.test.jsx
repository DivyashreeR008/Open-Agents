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

const agent = {
  id: 'openai-key-agent',
  name: 'OpenAI Key Agent',
  description: 'Tests OpenAI key errors',
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

describe('AgentRunner OpenAI invalid key message', () => {
  it('names OpenAI when the provider rejects the key', async () => {
    provider.streamAgent.mockRejectedValue({ type: 'invalid_api_key', provider: 'openai' })

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
  })
})
