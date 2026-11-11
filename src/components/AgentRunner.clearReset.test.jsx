import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const provider = vi.hoisted(() => ({ streamAgent: vi.fn() }))

vi.mock('../lib/llmAdapter', () => ({ streamAgent: provider.streamAgent }))
vi.mock('./ApiKeyBar', () => ({ default: () => null }))
vi.mock('./ApiKeyInfo', () => ({ default: () => null }))
vi.mock('./OutputRenderer', () => ({
  default: ({ content }) => <div data-testid="output">{content}</div>,
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
  id: 'clear-agent',
  name: 'Clear Agent',
  description: 'Exercises clear',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test prompt.',
  inputs: [
    { id: 'title', label: 'Title', type: 'text', defaultValue: 'Default title' },
    { id: 'body', label: 'Body', type: 'textarea', required: true },
    { id: 'tags', label: 'Tags', type: 'multiselect', options: ['alpha', 'beta'] },
  ],
}

const wrap = (key) => JSON.stringify({ key, expiresAt: Date.now() + 60_000 })

describe('AgentRunner clear', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    sessionStorage.setItem('oa_apikey_openai', wrap('sk-clear'))
    provider.streamAgent.mockReset()
    provider.streamAgent.mockResolvedValue({ content: 'generated answer', duration: 1200 })
  })

  it('discards the output and restores every input default', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Changed title' } })
    await user.type(screen.getByLabelText('Body'), 'some long prompt')
    fireEvent.click(screen.getByRole('button', { name: 'alpha' }))
    expect(screen.getByRole('button', { name: /alpha/ })).toHaveTextContent('✓')

    const run = screen.getByRole('button', { name: /run agent/i })
    await waitFor(() => expect(run).toBeEnabled())
    await user.click(run)
    expect(await screen.findByTestId('output')).toHaveTextContent('generated answer')

    await user.click(screen.getByRole('button', { name: /^clear$/i }))

    expect(screen.getByRole('alertdialog', { name: 'Clear this run?' })).toBeInTheDocument()
    expect(screen.getByTestId('output')).toHaveTextContent('generated answer')

    await user.click(screen.getByRole('button', { name: 'Clear run' }))

    expect(screen.queryByTestId('output')).toBeNull()
    expect(screen.getByLabelText('Title')).toHaveValue('Default title')
    expect(screen.getByLabelText('Body')).toHaveValue('')
    expect(screen.getByRole('button', { name: 'alpha' })).not.toHaveTextContent('✓')
    expect(screen.getByRole('button', { name: /run agent/i })).toBeDisabled()
  })

  it('keeps generated output and prompt when the confirmation is cancelled', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Body'), 'keep this prompt')
    const run = screen.getByRole('button', { name: /run agent/i })
    await waitFor(() => expect(run).toBeEnabled())
    await user.click(run)
    expect(await screen.findByTestId('output')).toHaveTextContent('generated answer')

    await user.click(screen.getByRole('button', { name: /^clear$/i }))
    expect(screen.getByRole('alertdialog', { name: 'Clear this run?' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('alertdialog', { name: 'Clear this run?' })).toBeNull()
    expect(screen.getByTestId('output')).toHaveTextContent('generated answer')
    expect(screen.getByLabelText('Body')).toHaveValue('keep this prompt')
    expect(screen.getByRole('button', { name: /^clear$/i })).toHaveFocus()
  })

  it('dismisses the clear confirmation on Escape without discarding anything', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Body'), 'careful prompt')
    const run = screen.getByRole('button', { name: /run agent/i })
    await waitFor(() => expect(run).toBeEnabled())
    await user.click(run)
    expect(await screen.findByTestId('output')).toHaveTextContent('generated answer')

    await user.click(screen.getByRole('button', { name: /^clear$/i }))
    fireEvent.keyDown(window, { key: 'Escape' })

    expect(screen.queryByRole('alertdialog', { name: 'Clear this run?' })).toBeNull()
    expect(screen.getByTestId('output')).toHaveTextContent('generated answer')
    expect(screen.getByLabelText('Body')).toHaveValue('careful prompt')
  })

  it('clears prompt inputs directly when there is no generated output', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Body'), 'temporary prompt')
    await user.click(screen.getByRole('button', { name: /^clear$/i }))

    expect(screen.queryByRole('alertdialog', { name: 'Clear this run?' })).toBeNull()
    expect(screen.getByLabelText('Body')).toHaveValue('')
  })
})
