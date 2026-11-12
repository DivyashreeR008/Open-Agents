import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const agentsState = vi.hoisted(() => ({ agents: [] }))
const service = vi.hoisted(() => ({ createAutomation: vi.fn(), updateAutomation: vi.fn() }))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: agentsState.agents }) }))
vi.mock('../lib/useApiKey', () => ({ useApiKey: () => ({ apiKey: '' }) }))
vi.mock('../lib/automationsService', async (importOriginal) => ({
  ...(await importOriginal()),
  createAutomation: service.createAutomation,
  updateAutomation: service.updateAutomation,
}))

import CreateAutomationModal from './CreateAutomationModal'

const agent = {
  id: 'error-agent',
  name: 'Error Agent',
  description: 'Surfaces save errors',
  category: 'Test',
  provider: 'openai',
  systemPrompt: 'Be helpful.',
  inputs: [{ id: 'topic', label: 'Topic', type: 'text' }],
}

beforeEach(() => {
  agentsState.agents = [agent]
  service.createAutomation.mockReset()
  service.createAutomation.mockRejectedValue({})
})

describe('CreateAutomationModal save error fallback', () => {
  it('shows a generic message when the service rejects without a message', async () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} />)

    fireEvent.change(screen.getByLabelText('Automation name'), {
      target: { value: 'Error job' },
    })
    fireEvent.change(screen.getByLabelText('openai API key'), { target: { value: 'sk-error' } })
    fireEvent.change(screen.getByLabelText('Recipient email address'), {
      target: { value: 'owner@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /activate autopilot/i }))

    await waitFor(() => expect(screen.getByText('Failed to save automation')).toBeInTheDocument())
  })
})
