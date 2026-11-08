import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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
  id: 'playground-agent',
  name: 'Playground Agent',
  description: 'Tests prompt editing',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Original system prompt.',
  inputs: [{ id: 'text', label: 'Text', type: 'textarea', placeholder: 'type here' }],
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('AgentRunner prompt playground', () => {
  it('opens, edits, flags, and resets a custom system prompt', () => {
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /edit system prompt/i }))
    const prompt = screen.getByLabelText('Custom system prompt')
    expect(prompt).toHaveValue('Original system prompt.')

    fireEvent.change(prompt, { target: { value: 'Custom system prompt.' } })
    expect(screen.getByText('Modified')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(prompt).toHaveValue('Original system prompt.')
    expect(screen.queryByText('Modified')).not.toBeInTheDocument()
  })
})
