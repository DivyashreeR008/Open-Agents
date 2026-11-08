import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
vi.mock('./ScheduleAgentModal', () => ({ default: () => null }))
vi.mock('./PromptHistoryPanel', () => ({
  default: ({ open, onClose, onUsePrompt }) =>
    open ? (
      <div>
        <button
          onClick={() => {
            onUsePrompt('restored from history')
            onClose()
          }}
        >
          Use saved prompt
        </button>
      </div>
    ) : null,
}))

import AgentRunner from './AgentRunner'

const agent = {
  id: 'history-agent',
  name: 'History Agent',
  description: 'Exercises prompt history',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test prompt.',
  inputs: [
    { id: 'title', label: 'Title', type: 'text' },
    { id: 'body', label: 'Body', type: 'textarea' },
  ],
}

const renderRunner = () =>
  render(
    <MemoryRouter>
      <AgentRunner agent={agent} />
    </MemoryRouter>
  )

describe('AgentRunner prompt history', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('saves the first free-text value with the agent identity', async () => {
    const user = userEvent.setup()
    renderRunner()

    await user.type(screen.getByLabelText('Title'), 'Write a launch plan')
    await user.click(screen.getByRole('button', { name: /save prompt/i }))

    const saved = JSON.parse(localStorage.getItem('oa_prompt_history'))
    expect(saved).toEqual([
      expect.objectContaining({
        text: 'Write a launch plan',
        agentId: 'history-agent',
        agentName: 'History Agent',
        favorite: false,
      }),
    ])
  })

  it('restores a saved prompt into the first free-text input', async () => {
    const user = userEvent.setup()
    renderRunner()

    await user.click(screen.getByTitle('Prompt History & Favorites'))
    await user.click(screen.getByRole('button', { name: /use saved prompt/i }))

    expect(screen.getByLabelText('Title')).toHaveValue('restored from history')
    expect(screen.getByLabelText('Body')).toHaveValue('')
    expect(screen.queryByRole('button', { name: /use saved prompt/i })).toBeNull()
  })

  it('keeps saving disabled until a free-text prompt exists', () => {
    renderRunner()

    const save = screen.getByRole('button', { name: /save prompt/i })
    expect(save).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Body'), { target: { value: '   ' } })
    expect(save).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Body'), { target: { value: 'real prompt' } })
    expect(save).toBeEnabled()
  })
})
