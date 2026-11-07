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
vi.mock('./PromptHistoryPanel', () => ({ default: () => null }))
vi.mock('./ScheduleAgentModal', () => ({ default: () => null }))

import AgentRunner from './AgentRunner'

const agent = {
  id: 'limit-agent',
  name: 'Limit Agent',
  description: 'Tests the character cap',
  category: 'Test',
  provider: 'any',
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
})

describe('AgentRunner character cap', () => {
  it('rejects a paste above the cap and accepts exactly the cap', () => {
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )
    const textarea = screen.getByPlaceholderText('type here')

    fireEvent.change(textarea, { target: { value: 'a'.repeat(4001) } })
    expect(textarea).toHaveValue('')
    expect(screen.getByText('0 / 4000 characters')).toBeInTheDocument()

    fireEvent.change(textarea, { target: { value: 'b'.repeat(4000) } })
    expect(textarea).toHaveValue('b'.repeat(4000))
    expect(screen.getByText('4000 / 4000 characters')).toBeInTheDocument()
  })
})
