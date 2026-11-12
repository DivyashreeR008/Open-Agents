import { render, screen } from '@testing-library/react'
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

const mysteryAgent = {
  id: 'mystery-provider',
  name: 'Mystery Agent',
  description: 'Uses a provider that is not in the model map',
  category: 'Test',
  provider: 'mystery',
  systemPrompt: 'Be mysterious.',
  inputs: [{ id: 'topic', label: 'Topic', type: 'text' }],
}

beforeEach(() => {
  agentsState.agents = [mysteryAgent]
})

describe('CreateAutomationModal unknown provider model', () => {
  it('falls back to the default OpenAI model for an unknown provider', () => {
    render(<CreateAutomationModal isOpen preselectedAgent={mysteryAgent} onClose={() => {}} />)

    expect(screen.getByLabelText('Model')).toHaveValue('gpt-4o')
  })
})
