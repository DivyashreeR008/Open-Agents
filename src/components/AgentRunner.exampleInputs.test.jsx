import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

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

const baseAgent = {
  id: 'example-agent',
  name: 'Example Agent',
  description: 'Exercises example inputs',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test prompt.',
  inputs: [
    { id: 'title', label: 'Title', type: 'text', defaultValue: 'Original title' },
    { id: 'body', label: 'Body', type: 'textarea' },
    { id: 'tags', label: 'Tags', type: 'multiselect', options: ['alpha', 'beta'] },
  ],
}

const renderRunner = (agent) =>
  render(
    <MemoryRouter>
      <AgentRunner agent={agent} />
    </MemoryRouter>
  )

describe('AgentRunner example inputs', () => {
  it('fills the sample values without overwriting unrelated user edits', () => {
    const agent = {
      ...baseAgent,
      exampleInputs: { body: 'Example body text', tags: ['beta'] },
    }
    renderRunner(agent)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'My title' } })
    fireEvent.click(screen.getByRole('button', { name: /try an example/i }))

    expect(screen.getByLabelText('Title')).toHaveValue('My title')
    expect(screen.getByLabelText('Body')).toHaveValue('Example body text')
    expect(screen.getByRole('button', { name: /beta/ })).toHaveTextContent('✓')
    expect(screen.getByRole('button', { name: 'alpha' })).not.toHaveTextContent('✓')
  })

  it('does nothing when the agent has no example inputs', () => {
    renderRunner(baseAgent)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Keep me' } })
    fireEvent.click(screen.getByRole('button', { name: /try an example/i }))

    expect(screen.getByLabelText('Title')).toHaveValue('Keep me')
    expect(screen.getByLabelText('Body')).toHaveValue('')
  })
})
