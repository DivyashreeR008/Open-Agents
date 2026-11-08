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
vi.mock('./BatchModeRunner', () => ({ default: () => <div>Batch runner panel</div> }))
vi.mock('./AgentPreviewPanel', () => ({ default: () => <div>Preview details panel</div> }))
vi.mock('./PromptHistoryPanel', () => ({ default: () => null }))
vi.mock('./ScheduleAgentModal', () => ({ default: () => null }))

import AgentRunner from './AgentRunner'

const agent = {
  id: 'toggle-agent',
  name: 'Toggle Agent',
  description: 'Tests view toggles',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test.',
  inputs: [{ id: 'text', label: 'Text', type: 'textarea', placeholder: 'type here' }],
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('AgentRunner view and batch toggles', () => {
  it('switches between code and preview views', () => {
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    expect(screen.queryByText('Preview details panel')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Preview' }))
    expect(screen.getByText('Preview details panel')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Code' }))
    expect(screen.queryByText('Preview details panel')).not.toBeInTheDocument()
  })

  it('enters and exits batch mode for a free-text agent', () => {
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /batch mode/i }))
    expect(screen.getByText('Batch runner panel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /exit batch mode/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /exit batch mode/i }))
    expect(screen.queryByText('Batch runner panel')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /batch mode/i })).toBeInTheDocument()
  })

  it('does not offer batch mode when no free-text input exists', () => {
    const selectOnly = {
      ...agent,
      id: 'select-only',
      inputs: [{ id: 'choice', label: 'Choice', type: 'select', options: ['A', 'B'] }],
    }
    render(
      <MemoryRouter>
        <AgentRunner agent={selectOnly} />
      </MemoryRouter>
    )
    expect(screen.queryByRole('button', { name: /batch mode/i })).not.toBeInTheDocument()
  })
})
