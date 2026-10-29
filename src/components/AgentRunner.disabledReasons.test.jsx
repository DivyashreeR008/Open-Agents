import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
// Heavy / irrelevant presentational children are stubbed so these tests focus on
// the run lifecycle. AgentRunner, useApiKey, useHistory, usePromptHistory,
// useSessionSpend, analytics and the REAL llmAdapter.streamAgent are all live.
vi.mock('./ApiKeyBar', () => ({ default: () => null }))
vi.mock('./ApiKeyInfo', () => ({ default: () => null }))
vi.mock('./OutputRenderer', () => ({ default: ({ content }) => <div data-testid="output">{content}</div> }))
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
  id: 'test-agent',
  name: 'Test Agent',
  description: 'An agent used in tests',
  category: 'Test',
  provider: 'any',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'You are a test agent.',
  inputs: [{ id: 'text', label: 'Text', type: 'textarea', required: true, placeholder: 'type here' }],
}

// ── fake `fetch` that behaves like a browser for streaming + abort ───────────

describe('AgentRunner disabled action reasons', () => {
  it('exposes a reason for each disabled action while inputs are empty', () => {
    render(<MemoryRouter><AgentRunner agent={agent} /></MemoryRouter>)
    const save = screen.getByRole('button', { name: /save prompt/i })
    const schedule = screen.getByRole('button', { name: /schedule/i })
    const clear = screen.getByRole('button', { name: /^clear$/i })
    for (const btn of [save, schedule, clear]) {
      expect(btn).toBeDisabled()
      const id = btn.getAttribute('aria-describedby')
      expect(id).toBeTruthy()
      expect(document.getElementById(id).textContent.trim()).not.toBe('')
    }
  })

  it('drops the reasons once the input has content', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><AgentRunner agent={agent} /></MemoryRouter>)
    await user.type(screen.getByPlaceholderText('type here'), 'hello')
    expect(screen.getByRole('button', { name: /save prompt/i })).not.toHaveAttribute('aria-describedby')
    expect(screen.getByRole('button', { name: /^clear$/i })).not.toHaveAttribute('aria-describedby')
  })
})
