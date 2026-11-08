import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const agentsState = vi.hoisted(() => ({ agents: [] }))
const keyState = vi.hoisted(() => ({ apiKey: '' }))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: agentsState.agents }) }))
vi.mock('../lib/useApiKey', () => ({ useApiKey: () => ({ apiKey: keyState.apiKey }) }))
vi.mock('../lib/automationsService', async (importOriginal) => ({
  ...(await importOriginal()),
  createAutomation: vi.fn(),
  updateAutomation: vi.fn(),
}))

import CreateAutomationModal from './CreateAutomationModal'

const anthropicAgent = {
  id: 'agent-a',
  name: 'Research Agent',
  description: 'Finds sources',
  category: 'Research',
  provider: 'anthropic',
  systemPrompt: 'Research carefully.',
  inputs: [
    { id: 'topic', label: 'Topic', type: 'text', defaultValue: 'AI agents' },
    { id: 'notes', label: 'Notes', type: 'textarea' },
    { id: 'tags', label: 'Tags', type: 'multiselect', options: ['news', 'papers'] },
  ],
}

const secondAgent = {
  id: 'agent-b',
  name: 'Code Reviewer',
  description: 'Reviews diffs',
  category: 'Engineering',
  provider: 'openai',
  systemPrompt: 'Review code.',
  inputs: [{ id: 'diff', label: 'Diff', type: 'textarea' }],
}

describe('CreateAutomationModal initial defaults', () => {
  beforeEach(() => {
    agentsState.agents = [anthropicAgent, secondAgent]
    keyState.apiKey = ''
  })

  it('selects the first agent and derives its name, inputs, provider, and model', () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} />)

    expect(screen.getByLabelText('Automation name')).toHaveValue('Research Agent Autopilot')
    expect(screen.getByLabelText('Topic')).toHaveValue('AI agents')
    expect(screen.getByLabelText('Notes')).toHaveValue('')
    expect(screen.getByLabelText('Model provider')).toHaveValue('anthropic')
    expect(screen.getByLabelText('Model')).toHaveValue('claude-3-5-sonnet-20241022')
    expect(screen.getByLabelText('Recipient email address')).toHaveValue('')
    expect(screen.getByRole('checkbox', { name: /explicit opt-in consent/i })).toBeChecked()
  })

  it('uses a preselected agent without showing the catalogue selector', () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} preselectedAgent={secondAgent} />)

    expect(screen.getByLabelText('Automation name')).toHaveValue('Code Reviewer Autopilot')
    expect(screen.getByLabelText('Diff')).toHaveValue('')
    expect(screen.getByLabelText('Model provider')).toHaveValue('openai')
    expect(screen.queryByLabelText('Search agents')).toBeNull()
    expect(screen.queryByText(/available$/)).toBeNull()
  })

  it('prefills a key passed through the shared API key hook', () => {
    keyState.apiKey = 'sk-from-hook'
    render(<CreateAutomationModal isOpen onClose={() => {}} preselectedAgent={secondAgent} />)

    expect(screen.getByLabelText('openai API key')).toHaveValue('sk-from-hook')
  })
})
