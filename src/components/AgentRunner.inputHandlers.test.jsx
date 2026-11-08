import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

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
  id: 'input-agent',
  name: 'Input Agent',
  description: 'Tests input handlers',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test.',
  inputs: [
    { id: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'Enter topic' },
    { id: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Enter notes' },
  ],
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  provider.streamAgent.mockReset()
})

describe('AgentRunner input handlers', () => {
  it('updates text fields and keeps the run disabled for whitespace-only required input', () => {
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Set test key' }))
    const run = screen.getByRole('button', { name: /run agent/i })
    expect(run).toBeDisabled()

    const topic = screen.getByLabelText('Topic')
    fireEvent.change(topic, { target: { value: '   ' } })
    expect(topic).toHaveValue('   ')
    expect(run).toBeDisabled()

    fireEvent.change(topic, { target: { value: 'AI safety' } })
    expect(run).toBeEnabled()

    const notes = screen.getByLabelText('Notes')
    fireEvent.change(notes, { target: { value: 'Include recent papers.' } })
    expect(notes).toHaveValue('Include recent papers.')
  })
})
