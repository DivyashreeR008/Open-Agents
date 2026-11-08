import { render, screen } from '@testing-library/react'
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
vi.mock('./PromptHistoryPanel', () => ({ default: () => null }))
vi.mock('./ScheduleAgentModal', () => ({ default: () => null }))

import AgentRunner from './AgentRunner'

const agent = {
  id: 'unknown-provider-agent',
  name: 'Unknown Provider Agent',
  description: 'Tests provider label fallback',
  category: 'Test',
  provider: 'mystery',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test.',
  inputs: [{ id: 'text', label: 'Text', type: 'textarea', placeholder: 'type here' }],
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('AgentRunner provider label fallback', () => {
  it('shows the raw provider value when no friendly label exists', () => {
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )
    expect(screen.getByText('mystery')).toBeInTheDocument()
  })
})
