import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const analyser = vi.hoisted(() => ({ analyseModels: vi.fn() }))

vi.mock('../lib/modelAnalyser', () => ({ analyseModels: analyser.analyseModels }))
vi.mock('./ApiKeyBar', () => ({ default: () => null }))
vi.mock('./ApiKeyInfo', () => ({ default: () => null }))
vi.mock('./OutputRenderer', () => ({
  default: ({ content }) => <div data-testid="recommendation">{content}</div>,
}))
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
  id: 'analyser-agent',
  name: 'Analyser Agent',
  description: 'Exercises the model analyser',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test prompt.',
  inputs: [{ id: 'body', label: 'Body', type: 'textarea' }],
}

const wrap = (key) => JSON.stringify({ key, expiresAt: Date.now() + 60_000 })

const renderRunner = () =>
  render(
    <MemoryRouter>
      <AgentRunner agent={agent} />
    </MemoryRouter>
  )

describe('AgentRunner model analyser', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    analyser.analyseModels.mockReset()
  })

  it('renders the recommendation and can clear it for another analysis', async () => {
    sessionStorage.setItem('oa_apikey_openai', wrap('sk-analyse'))
    analyser.analyseModels.mockResolvedValue('Use gpt-4o-mini for this task.')
    const user = userEvent.setup()
    renderRunner()

    await user.click(screen.getByRole('button', { name: /model analyser/i }))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /analyse models/i })).toBeInTheDocument()
    )
    await user.click(screen.getByRole('button', { name: /analyse models/i }))

    expect(await screen.findByTestId('recommendation')).toHaveTextContent(
      'Use gpt-4o-mini for this task.'
    )
    expect(analyser.analyseModels).toHaveBeenCalledWith(agent, 'sk-analyse', 'openai')

    await user.click(screen.getByRole('button', { name: /re-analyse/i }))
    expect(screen.queryByTestId('recommendation')).toBeNull()
    expect(screen.getByRole('button', { name: /analyse models/i })).toBeInTheDocument()
  })

  it('asks for a key instead of offering the analysis when none is saved', async () => {
    const user = userEvent.setup()
    renderRunner()

    await user.click(screen.getByRole('button', { name: /model analyser/i }))

    expect(screen.getByText('Add an API key above to analyse models.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /analyse models/i })).toBeNull()
    expect(analyser.analyseModels).not.toHaveBeenCalled()
  })

  it('reports a failed analysis and re-enables the action', async () => {
    sessionStorage.setItem('oa_apikey_openai', wrap('sk-analyse'))
    analyser.analyseModels.mockRejectedValue(new Error('model catalogue unavailable'))
    const user = userEvent.setup()
    renderRunner()

    await user.click(screen.getByRole('button', { name: /model analyser/i }))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /analyse models/i })).toBeInTheDocument()
    )
    await user.click(screen.getByRole('button', { name: /analyse models/i }))

    expect(
      await screen.findByText('Failed to analyse models. Please try again.')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /re-analyse/i })).toBeInTheDocument()
  })
})
