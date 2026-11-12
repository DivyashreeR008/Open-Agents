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
  id: 'limit-consistency-agent',
  name: 'Limit Consistency Agent',
  description: 'Checks one prompt limit everywhere',
  category: 'Test',
  provider: 'any',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Keep it short.',
  inputs: [
    { id: 'brief', label: 'Brief', type: 'textarea', required: true, placeholder: 'brief' },
    { id: 'snippet', label: 'Snippet', type: 'code', placeholder: 'code' },
  ],
}

function renderRunner() {
  return render(
    <MemoryRouter>
      <AgentRunner agent={agent} />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('AgentRunner prompt limit consistency', () => {
  it('applies the same cap to textarea and code inputs', () => {
    renderRunner()
    const brief = screen.getByPlaceholderText('brief')
    const code = screen.getByPlaceholderText('code')

    expect(brief).toHaveAttribute('maxLength', '4000')
    expect(code).toHaveAttribute('maxLength', '4000')

    fireEvent.change(code, { target: { value: 'x'.repeat(4001) } })
    expect(code).toHaveValue('')

    fireEvent.change(code, { target: { value: 'x'.repeat(4000) } })
    expect(code).toHaveValue('x'.repeat(4000))
    expect(screen.getByText(/4000 \/ 4000 characters/)).toBeInTheDocument()
    expect(screen.getByText('Limit reached')).toBeInTheDocument()
  })

  it('applies the same cap to the system prompt and reports the limit', () => {
    renderRunner()
    fireEvent.click(screen.getByRole('button', { name: /Prompt Playground/ }))

    const prompt = screen.getByLabelText('Custom system prompt')
    expect(prompt).toHaveAttribute('maxLength', '4000')
    expect(prompt).toHaveValue('Keep it short.')

    fireEvent.change(prompt, { target: { value: 'y'.repeat(4001) } })
    expect(prompt).toHaveValue('Keep it short.')

    fireEvent.change(prompt, { target: { value: 'y'.repeat(4000) } })
    expect(prompt).toHaveValue('y'.repeat(4000))
    expect(screen.getByText(/4000 \/ 4000 characters/)).toBeInTheDocument()
    expect(screen.getByText('Limit reached')).toBeInTheDocument()
  })
})
