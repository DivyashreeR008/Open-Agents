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
  id: 'publisher',
  name: 'Publisher',
  description: 'Publishes updates',
  category: 'Marketing',
  provider: 'openai',
  systemPrompt: 'Write carefully.',
  inputs: [
    { id: 'brief', label: 'Brief', type: 'text' },
    { id: 'channels', label: 'Channels', type: 'multiselect', options: ['email', 'sms', 'slack'] },
  ],
}

describe('CreateAutomationModal creation submit', () => {
  beforeEach(() => {
    agentsState.agents = [agent]
    service.createAutomation.mockReset()
    service.updateAutomation.mockReset()
    service.createAutomation.mockResolvedValue({ id: 'auto_new' })
  })

  it('submits the selected schedule, policy, provider, inputs, and multiselect values', async () => {
    const onClose = vi.fn()
    const onSuccess = vi.fn()
    render(<CreateAutomationModal isOpen onClose={onClose} onSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText('Automation name'), {
      target: { value: '  Weekly publisher  ' },
    })
    fireEvent.change(screen.getByLabelText('openai API key'), { target: { value: ' sk-create ' } })
    fireEvent.change(screen.getByLabelText('Brief'), { target: { value: 'Launch notes' } })
    fireEvent.click(screen.getByRole('button', { name: 'email' }))
    fireEvent.click(screen.getByRole('button', { name: 'sms' }))
    fireEvent.click(screen.getByRole('button', { name: 'slack' }))
    fireEvent.click(screen.getByRole('button', { name: /sms/ }))
    fireEvent.click(screen.getByRole('button', { name: /every hour/i }))
    fireEvent.change(screen.getByLabelText(/if runs are missed/i), { target: { value: 'skip' } })
    fireEvent.change(screen.getByLabelText('Model provider'), { target: { value: 'openrouter' } })
    fireEvent.change(screen.getByLabelText('Model'), {
      target: { value: 'anthropic/claude-3.5-sonnet' },
    })
    fireEvent.change(screen.getByLabelText('Recipient email address'), {
      target: { value: 'owner@example.com' },
    })

    fireEvent.click(screen.getByRole('button', { name: /activate autopilot/i }))

    await waitFor(() => expect(service.createAutomation).toHaveBeenCalledTimes(1))
    expect(service.createAutomation).toHaveBeenCalledWith({
      name: 'Weekly publisher',
      agentId: 'publisher',
      agentName: 'Publisher',
      category: 'Marketing',
      provider: 'openrouter',
      model: 'anthropic/claude-3.5-sonnet',
      schedule: 'hourly',
      missedPolicy: 'skip',
      inputs: { brief: 'Launch notes', channels: ['email', 'slack'] },
      systemPrompt: 'Write carefully.',
      apiKey: 'sk-create',
      emailNotification: true,
      notificationEmail: 'owner@example.com',
    })
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows a saving state and blocks duplicate submissions while the write is pending', async () => {
    let resolveCreate
    service.createAutomation.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCreate = resolve
        })
    )
    const onClose = vi.fn()
    render(<CreateAutomationModal isOpen onClose={onClose} />)

    fireEvent.change(screen.getByLabelText('Automation name'), {
      target: { value: 'Pending job' },
    })
    fireEvent.change(screen.getByLabelText('openai API key'), { target: { value: 'sk-pending' } })
    fireEvent.change(screen.getByLabelText('Recipient email address'), {
      target: { value: 'owner@example.com' },
    })

    fireEvent.click(screen.getByRole('button', { name: /activate autopilot/i }))

    const saving = screen.getByRole('button', { name: /saving automation/i })
    expect(saving).toBeDisabled()
    fireEvent.click(saving)
    expect(service.createAutomation).toHaveBeenCalledTimes(1)

    resolveCreate({ id: 'auto_pending' })
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })
})
