import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/llmAdapter', () => ({ streamAgent: vi.fn() }))
vi.mock('./ApiKeyBar', () => ({ default: () => null }))
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
  id: 'whitespace-required',
  name: 'Whitespace Required',
  description: 'Rejects whitespace-only input',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test prompt.',
  inputs: [{ id: 'brief', label: 'Brief', type: 'textarea', required: true }],
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('AgentRunner whitespace-only required input', () => {
  it('keeps the run button disabled when a required field contains only spaces', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Brief'), '   ')

    expect(screen.getByRole('button', { name: /run agent/i })).toBeDisabled()
    expect(screen.getByText('Fill required inputs before scheduling.')).toBeInTheDocument()
  })
})
