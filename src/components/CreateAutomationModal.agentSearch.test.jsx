import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const agentsState = vi.hoisted(() => ({ agents: [] }))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: agentsState.agents }) }))
vi.mock('../lib/useApiKey', () => ({ useApiKey: () => ({ apiKey: '' }) }))
vi.mock('../lib/automationsService', async (importOriginal) => ({
  ...(await importOriginal()),
  createAutomation: vi.fn(),
  updateAutomation: vi.fn(),
}))

import CreateAutomationModal from './CreateAutomationModal'

const agents = [
  {
    id: 'research',
    name: 'Research Agent',
    description: 'Finds sources',
    category: 'Research',
    provider: 'anthropic',
    systemPrompt: 'Research.',
    inputs: [{ id: 'topic', label: 'Topic', type: 'text' }],
  },
  {
    id: 'reviewer',
    name: 'Code Reviewer',
    description: 'Reviews diffs',
    category: 'Engineering',
    provider: 'gemini',
    systemPrompt: 'Review.',
    inputs: [{ id: 'diff', label: 'Diff', type: 'textarea' }],
  },
]

describe('CreateAutomationModal agent search', () => {
  beforeEach(() => {
    agentsState.agents = agents
  })

  it('filters the catalogue by name or category and reports an empty result', () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} />)
    const search = screen.getByLabelText('Search agents')

    fireEvent.change(search, { target: { value: 'engineering' } })
    expect(screen.getByRole('button', { name: /Code Reviewer/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Research Agent/ })).toBeNull()

    fireEvent.change(search, { target: { value: 'research' } })
    expect(screen.getByRole('button', { name: /Research Agent/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Code Reviewer/ })).toBeNull()

    fireEvent.change(search, { target: { value: 'nothing-matches' } })
    expect(screen.getByText('No agents match “nothing-matches”.')).toBeInTheDocument()
  })

  it('switches the derived name, inputs, provider, and model with the agent', () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} />)
    expect(screen.getByLabelText('Automation name')).toHaveValue('Research Agent Autopilot')

    fireEvent.click(screen.getByRole('button', { name: /Code Reviewer/ }))

    expect(screen.getByLabelText('Automation name')).toHaveValue('Code Reviewer Autopilot')
    expect(screen.getByLabelText('Diff')).toHaveValue('')
    expect(screen.queryByLabelText('Topic')).toBeNull()
    expect(screen.getByLabelText('Model provider')).toHaveValue('gemini')
    expect(screen.getByLabelText('Model')).toHaveValue('gemini-2.5-flash')
  })
})
