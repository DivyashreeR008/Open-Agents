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

const agent = {
  id: 'defaults-agent',
  name: 'Defaults Agent',
  description: 'Exercises input initialisation',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Original prompt.',
  inputs: [
    { id: 'title', label: 'Title', type: 'text', defaultValue: 'Draft title' },
    { id: 'body', label: 'Body', type: 'textarea' },
    { id: 'code', label: 'Code', type: 'code', defaultValue: 'const answer = 42' },
    { id: 'tags', label: 'Tags', type: 'multiselect', options: ['alpha', 'beta'] },
    { id: 'tone', label: 'Tone', type: 'select', defaultValue: 'formal', options: [] },
  ],
}

describe('AgentRunner input defaults', () => {
  it('initialises text, code, multiselect, and blank fields from the agent definition', () => {
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    expect(screen.getByLabelText('Title')).toHaveValue('Draft title')
    expect(screen.getByLabelText('Body')).toHaveValue('')
    expect(screen.getByLabelText('Code')).toHaveValue('const answer = 42')
    expect(screen.getByRole('button', { name: 'alpha' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'alpha' })).not.toHaveTextContent('✓')
    expect(screen.getByRole('button', { name: 'beta' })).not.toHaveTextContent('✓')
  })

  it('applies re-run inputs from route state without discarding other defaults', () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/agent/defaults-agent',
            state: {
              prefill: {
                body: 'retry this request',
                tags: ['beta'],
                unknown: 'ignored',
              },
            },
          },
        ]}
      >
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    expect(screen.getByLabelText('Title')).toHaveValue('Draft title')
    expect(screen.getByLabelText('Body')).toHaveValue('retry this request')
    expect(screen.getByLabelText('Code')).toHaveValue('const answer = 42')
    expect(screen.getByRole('button', { name: /beta/ })).toHaveTextContent('✓')
    expect(screen.getByRole('button', { name: /alpha/ })).not.toHaveTextContent('✓')
  })

  it('resets every value when the selected agent changes', () => {
    const { rerender } = render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByLabelText('Body'), { target: { value: 'user text' } })
    fireEvent.click(screen.getByRole('button', { name: 'alpha' }))
    expect(screen.getByRole('button', { name: /alpha/ })).toHaveTextContent('✓')

    const nextAgent = {
      ...agent,
      id: 'defaults-agent-two',
      name: 'Second Agent',
      systemPrompt: 'Second prompt.',
      inputs: [{ id: 'query', label: 'Query', type: 'text', defaultValue: 'second default' }],
    }
    rerender(
      <MemoryRouter>
        <AgentRunner agent={nextAgent} />
      </MemoryRouter>
    )

    expect(screen.queryByLabelText('Body')).toBeNull()
    expect(screen.getByLabelText('Query')).toHaveValue('second default')
    fireEvent.click(screen.getByRole('button', { name: /prompt playground/i }))
    expect(screen.getByLabelText('Custom system prompt')).toHaveValue('Second prompt.')
  })
})
