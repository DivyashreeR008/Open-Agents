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
  provider: 'openai',
  systemPrompt: 'Research.',
  inputs: [],
}

const submit = () => fireEvent.click(screen.getByRole('button', { name: /Activate Autopilot/i }))

describe('CreateAutomationModal required fields', () => {
  beforeEach(() => {
    agentsState.agents = [agent]
    service.createAutomation.mockReset()
    service.updateAutomation.mockReset()
    service.createAutomation.mockResolvedValue({ id: 'auto_new' })
  })

  it('requires a non-blank name', async () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} preselectedAgent={agent} />)
    fireEvent.change(screen.getByLabelText('Automation name'), { target: { value: '   ' } })
    fireEvent.change(screen.getByLabelText('openai API key'), { target: { value: 'sk-test' } })
    submit()

    expect(
      await screen.findByText('Please provide a name for this automation.')
    ).toBeInTheDocument()
    expect(service.createAutomation).not.toHaveBeenCalled()
  })

  it('requires an agent when the catalogue is empty', async () => {
    agentsState.agents = []
    render(<CreateAutomationModal isOpen onClose={() => {}} />)
    fireEvent.change(screen.getByLabelText('Automation name'), {
      target: { value: 'No agent job' },
    })
    fireEvent.change(screen.getByLabelText('openai API key'), { target: { value: 'sk-test' } })
    submit()

    expect(await screen.findByText('Please select an agent.')).toBeInTheDocument()
    expect(service.createAutomation).not.toHaveBeenCalled()
  })

  it('requires encrypted-storage consent before submitting', async () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} preselectedAgent={agent} />)
    fireEvent.change(screen.getByLabelText('Automation name'), {
      target: { value: 'Consent job' },
    })
    fireEvent.change(screen.getByLabelText('openai API key'), { target: { value: 'sk-test' } })
    fireEvent.click(screen.getByRole('checkbox', { name: /explicit opt-in consent/i }))
    submit()

    expect(
      await screen.findByText('Please opt-in to encrypted key storage to enable automated runs.')
    ).toBeInTheDocument()
    expect(service.createAutomation).not.toHaveBeenCalled()
  })

  it('requires a recipient while execution reports are enabled', async () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} preselectedAgent={agent} />)
    fireEvent.change(screen.getByLabelText('Automation name'), {
      target: { value: 'Report job' },
    })
    fireEvent.change(screen.getByLabelText('openai API key'), { target: { value: 'sk-test' } })
    submit()

    expect(
      await screen.findByText('Please enter a recipient email for execution reports.')
    ).toBeInTheDocument()
    expect(service.createAutomation).not.toHaveBeenCalled()
  })

  it('keeps the dialog open and ignores duplicate clicks while saving', async () => {
    let resolveCreate
    service.createAutomation.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCreate = resolve
        })
    )
    const onClose = vi.fn()
    render(<CreateAutomationModal isOpen onClose={onClose} preselectedAgent={agent} />)
    fireEvent.change(screen.getByLabelText('Automation name'), {
      target: { value: 'Pending report' },
    })
    fireEvent.change(screen.getByLabelText('openai API key'), { target: { value: 'sk-test' } })
    fireEvent.change(screen.getByLabelText('Recipient email address'), {
      target: { value: 'owner@example.com' },
    })

    submit()
    const saving = await screen.findByRole('button', { name: /Saving Automation/i })
    expect(saving).toBeDisabled()
    expect(onClose).not.toHaveBeenCalled()

    resolveCreate({ id: 'auto_done' })
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })
})
