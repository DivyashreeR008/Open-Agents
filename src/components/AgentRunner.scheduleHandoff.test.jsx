import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const scheduler = vi.hoisted(() => ({ addJob: vi.fn() }))

vi.mock('../lib/useScheduler', () => ({
  useScheduler: () => ({ addJob: scheduler.addJob }),
}))
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
vi.mock('./ScheduleAgentModal', () => ({
  default: ({ agent, inputs, provider, apiKey, onSchedule, onClose }) => (
    <div>
      <pre data-testid="schedule-context">
        {JSON.stringify({ agentId: agent.id, inputs, provider, apiKey })}
      </pre>
      <button
        onClick={() =>
          onSchedule({
            label: 'Nightly brief',
            schedule: 'daily',
            model: 'gpt-4o',
            apiKey: 'sk-scheduled',
          })
        }
      >
        Confirm schedule
      </button>
      <button onClick={onClose}>Close schedule</button>
    </div>
  ),
}))

import AgentRunner from './AgentRunner'

const agent = {
  id: 'schedule-agent',
  name: 'Schedule Agent',
  description: 'Hands inputs to the scheduler',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test prompt.',
  inputs: [{ id: 'brief', label: 'Brief', type: 'text', required: true }],
}

const wrap = (key) => JSON.stringify({ key, expiresAt: Date.now() + 60_000 })

describe('AgentRunner schedule handoff', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    sessionStorage.setItem('oa_apikey_openai', wrap('sk-live'))
    scheduler.addJob.mockReset()
  })

  it('passes the current agent, inputs, provider, and key to the schedule modal', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Brief'), 'Daily operations brief')
    await waitFor(() => expect(screen.getByRole('button', { name: /run agent/i })).toBeEnabled())
    await user.click(screen.getByRole('button', { name: /^schedule$/i }))

    expect(JSON.parse(screen.getByTestId('schedule-context').textContent)).toEqual({
      agentId: 'schedule-agent',
      inputs: { brief: 'Daily operations brief' },
      provider: 'openai',
      apiKey: 'sk-live',
    })

    await user.click(screen.getByRole('button', { name: /confirm schedule/i }))

    expect(scheduler.addJob).toHaveBeenCalledWith({
      agentId: 'schedule-agent',
      agentName: 'Schedule Agent',
      agentDefinition: agent,
      inputs: { brief: 'Daily operations brief' },
      label: 'Nightly brief',
      schedule: 'daily',
      model: 'gpt-4o',
      apiKey: 'sk-scheduled',
    })
  })

  it('closes the schedule modal without adding a job', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Brief'), 'A brief')
    await user.click(screen.getByRole('button', { name: /^schedule$/i }))
    await user.click(screen.getByRole('button', { name: /close schedule/i }))

    expect(screen.queryByTestId('schedule-context')).toBeNull()
    expect(scheduler.addJob).not.toHaveBeenCalled()
  })
})
