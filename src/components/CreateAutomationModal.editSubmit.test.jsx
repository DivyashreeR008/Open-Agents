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
  id: 'agent-a',
  name: 'Research Agent',
  description: 'Finds sources',
  category: 'Research',
  provider: 'anthropic',
  systemPrompt: 'Research.',
  inputs: [
    { id: 'topic', label: 'Topic', type: 'text' },
    { id: 'tags', label: 'Tags', type: 'multiselect', options: ['news', 'papers'] },
  ],
}

const existing = {
  id: 'auto_existing',
  agentId: 'agent-a',
  name: 'Existing nightly job',
  schedule: 'weekly',
  missedPolicy: 'not-a-real-policy',
  provider: 'gemini',
  model: 'gemini-1.5-pro',
  hasKey: true,
  inputs: { topic: 'old topic', tags: ['papers'] },
  emailNotification: false,
  notificationEmail: '',
}

describe('CreateAutomationModal edit mode', () => {
  beforeEach(() => {
    agentsState.agents = [agent]
    service.createAutomation.mockReset()
    service.updateAutomation.mockReset()
  })

  it('prefills the saved job and updates without sending an empty key', async () => {
    service.updateAutomation.mockResolvedValue({ id: existing.id })
    const onClose = vi.fn()
    const onSuccess = vi.fn()
    render(
      <CreateAutomationModal
        isOpen
        onClose={onClose}
        onSuccess={onSuccess}
        initialData={existing}
      />
    )

    expect(screen.getByLabelText('Automation name')).toHaveValue('Existing nightly job')
    expect(screen.getByLabelText('Topic')).toHaveValue('old topic')
    expect(screen.getByRole('button', { name: /papers/ })).toBeInTheDocument()
    expect(screen.getByLabelText('Model provider')).toHaveValue('gemini')
    expect(screen.getByLabelText('Model')).toHaveValue('gemini-1.5-pro')
    expect(screen.getByLabelText(/if runs are missed/i)).toHaveValue('run_once')
    expect(screen.queryByLabelText('Recipient email address')).toBeNull()

    fireEvent.change(screen.getByLabelText('Automation name'), {
      target: { value: '  Renamed job  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }))

    await waitFor(() => expect(service.updateAutomation).toHaveBeenCalledTimes(1))
    expect(service.updateAutomation).toHaveBeenCalledWith(existing.id, {
      name: 'Renamed job',
      schedule: 'weekly',
      missedPolicy: 'run_once',
      inputs: { topic: 'old topic', tags: ['papers'] },
      provider: 'gemini',
      model: 'gemini-1.5-pro',
      apiKey: undefined,
      emailNotification: false,
      notificationEmail: '',
    })
    expect(service.createAutomation).not.toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('sends a replacement key and reports a failed update without closing', async () => {
    service.updateAutomation.mockRejectedValue(new Error('Network write failed'))
    const onClose = vi.fn()
    render(
      <CreateAutomationModal
        isOpen
        onClose={onClose}
        initialData={{ ...existing, hasKey: false }}
      />
    )

    fireEvent.change(screen.getByLabelText('gemini API key'), {
      target: { value: '  sk-replacement  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }))

    expect(await screen.findByText('Network write failed')).toBeInTheDocument()
    expect(service.updateAutomation).toHaveBeenCalledWith(
      existing.id,
      expect.objectContaining({ apiKey: 'sk-replacement' })
    )
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeEnabled()
  })
})
