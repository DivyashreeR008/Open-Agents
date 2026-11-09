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

const first = {
  id: 'first-agent',
  name: 'First Agent',
  description: 'First',
  category: 'Test',
  provider: 'openai',
  systemPrompt: 'First.',
  inputs: [{ id: 'one', label: 'One', type: 'text' }],
}

const second = {
  id: 'second-agent',
  name: 'Second Agent',
  description: 'Second',
  category: 'Test',
  provider: 'gemini',
  systemPrompt: 'Second.',
  inputs: [{ id: 'two', label: 'Two', type: 'text' }],
}

beforeEach(() => {
  agentsState.agents = [first, second]
})

describe('CreateAutomationModal custom name retention', () => {
  it('does not overwrite a custom name when the selected agent changes', () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} />)

    fireEvent.change(screen.getByLabelText('Automation name'), {
      target: { value: 'My custom job' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Second Agent/ }))

    expect(screen.getByLabelText('Automation name')).toHaveValue('My custom job')
    expect(screen.getByLabelText('Two')).toBeInTheDocument()
  })
})
