import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const agentsState = vi.hoisted(() => ({ agents: [] }))
const service = vi.hoisted(() => ({ createAutomation: vi.fn(), updateAutomation: vi.fn() }))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: agentsState.agents }) }))
vi.mock('../lib/automationsService', async (importOriginal) => ({
  ...(await importOriginal()),
  createAutomation: service.createAutomation,
  updateAutomation: service.updateAutomation,
}))

import { clearAllGlobalKeys, getGlobalKeys, saveGlobalKeys } from '../lib/globalKeys'
import CreateAutomationModal from './CreateAutomationModal'

const agent = {
  id: 'publisher',
  name: 'Publisher',
  description: 'Publishes updates',
  category: 'Marketing',
  provider: 'openai',
  systemPrompt: '',
  inputs: [],
}

beforeEach(() => {
  sessionStorage.clear()
  localStorage.clear()
  clearAllGlobalKeys()
  vi.clearAllMocks()
  agentsState.agents = [agent]
  service.createAutomation.mockResolvedValue({ id: 'auto_new' })
})

describe('CreateAutomationModal provider key ownership', () => {
  it('does not carry another provider key into the selected provider', async () => {
    saveGlobalKeys({ openai: 'sk-openai-only' })
    render(<CreateAutomationModal isOpen onClose={() => {}} preselectedAgent={agent} />)

    const keyInput = screen.getByLabelText('openai API key')
    expect(keyInput).toHaveValue('sk-openai-only')

    fireEvent.change(screen.getByLabelText('Model provider'), { target: { value: 'anthropic' } })

    expect(screen.getByLabelText('anthropic API key')).toHaveValue('')
    expect(screen.getByText(/No Anthropic key is available/)).toBeInTheDocument()
    expect(getGlobalKeys().openai).toBe('sk-openai-only')

    fireEvent.change(screen.getByLabelText('Automation name'), {
      target: { value: 'Wrong provider check' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Activate Autopilot/i }))

    expect(
      await screen.findByText('Enter a Anthropic API key to run background automations.')
    ).toBeInTheDocument()
    expect(service.createAutomation).not.toHaveBeenCalled()
  })

  it('uses the saved key for the initially selected provider', () => {
    saveGlobalKeys({ openrouter: 'sk-openrouter-saved' })
    const openrouterAgent = { ...agent, id: 'openrouter-publisher', provider: 'openrouter' }
    agentsState.agents = [openrouterAgent]

    render(<CreateAutomationModal isOpen onClose={() => {}} preselectedAgent={openrouterAgent} />)

    expect(screen.getByLabelText('openrouter API key')).toHaveValue('sk-openrouter-saved')
    expect(
      screen.getByText(/This automation will use the OpenRouter key shown above/)
    ).toBeInTheDocument()
  })
})
