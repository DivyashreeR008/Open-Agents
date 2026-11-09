import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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
vi.mock('./PromptHistoryPanel', () => ({
  default: ({ open, onUsePrompt, onClose }) =>
    open ? (
      <button
        type="button"
        onClick={() => {
          onUsePrompt('restored prompt')
          onClose()
        }}
      >
        Use saved prompt
      </button>
    ) : null,
}))
vi.mock('./ScheduleAgentModal', () => ({ default: () => null }))

import AgentRunner from './AgentRunner'

const agent = {
  id: 'select-history-agent',
  name: 'Select History Agent',
  description: 'Tests history without a free-text field',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test.',
  inputs: [{ id: 'choice', label: 'Choice', type: 'select', options: ['A', 'B'] }],
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('AgentRunner prompt history without a text field', () => {
  it('ignores a restored prompt when the agent has no free-text input', () => {
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByTitle('Prompt History & Favorites'))
    fireEvent.click(screen.getByRole('button', { name: 'Use saved prompt' }))

    expect(screen.queryByRole('button', { name: 'Use saved prompt' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Choice' })).toBeInTheDocument()
  })
})
