import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./ApiKeyBar', () => ({
  default: ({ setProvider, setApiKey }) => (
    <div>
      <button type="button" onClick={() => setProvider('gemini')}>
        Choose Gemini
      </button>
      <button type="button" onClick={() => setApiKey('sk-gemini')}>
        Set key
      </button>
    </div>
  ),
}))
vi.mock('./ApiKeyInfo', () => ({ default: () => null }))
vi.mock('./OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))
vi.mock('./VoiceInput', () => ({ default: () => null }))
vi.mock('./RunRating', () => ({ default: () => null }))
vi.mock('./SuggestedChainPills', () => ({ default: () => null }))
vi.mock('./CostEstimator', () => ({ default: () => null }))
vi.mock('./TokenCounter', () => ({ default: () => null }))
vi.mock('./BatchModeRunner', () => ({
  default: ({ provider }) => <div>Batch provider: {provider}</div>,
}))
vi.mock('./AgentPreviewPanel', () => ({ default: () => null }))
vi.mock('./PromptHistoryPanel', () => ({ default: () => null }))
vi.mock('./ScheduleAgentModal', () => ({ default: () => null }))

import AgentRunner from './AgentRunner'

const agent = {
  id: 'any-provider-agent',
  name: 'Any Provider Agent',
  description: 'Tests the batch provider handoff',
  category: 'Test',
  provider: 'any',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test.',
  inputs: [{ id: 'text', label: 'Text', type: 'textarea', placeholder: 'type here' }],
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('AgentRunner batch mode provider handoff', () => {
  it('passes the selected provider when the agent accepts any provider', () => {
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Choose Gemini' }))
    fireEvent.click(screen.getByRole('button', { name: /batch mode/i }))

    expect(screen.getByText('Batch provider: gemini')).toBeInTheDocument()
  })
})
