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

const anyAgent = {
  id: 'any-provider',
  name: 'Any Provider Agent',
  description: 'Runs on the selected provider',
  category: 'Test',
  provider: 'any',
  systemPrompt: 'Be helpful.',
  inputs: [{ id: 'topic', label: 'Topic', type: 'text' }],
}

beforeEach(() => {
  agentsState.agents = [anyAgent]
})

describe('CreateAutomationModal any-provider defaults', () => {
  it('uses OpenAI and its default model when the agent accepts any provider', () => {
    render(<CreateAutomationModal isOpen preselectedAgent={anyAgent} onClose={() => {}} />)

    expect(screen.getByLabelText('Model provider')).toHaveValue('openai')
    expect(screen.getByLabelText('Model')).toHaveValue('gpt-4o')
  })
})
