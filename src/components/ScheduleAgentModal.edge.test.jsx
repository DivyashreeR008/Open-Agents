import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScheduleAgentModal from './ScheduleAgentModal'

const service = vi.hoisted(() => ({
  createAutomation: vi.fn(),
}))

vi.mock('../lib/automationsService', () => ({
  SCHEDULE_PRESETS: [
    { value: 'hourly', label: 'Every hour' },
    { value: 'daily', label: 'Every day (9:00 AM)' },
    { value: 'weekly', label: 'Every week (Mon 9:00 AM)' },
  ],
  createAutomation: service.createAutomation,
}))

const agent = {
  id: 'seo-agent',
  name: 'SEO Agent',
  category: 'Marketing',
  systemPrompt: 'Analyze SEO.',
}

function renderModal(props = {}) {
  return render(
    <ScheduleAgentModal
      agent={agent}
      inputs={{}}
      provider="openai"
      apiKey=""
      onSchedule={vi.fn()}
      onClose={vi.fn()}
      {...props}
    />
  )
}

beforeEach(() => {
  service.createAutomation.mockReset()
})

describe('ScheduleAgentModal validation and activation', () => {
  it('explains every missing requirement before scheduling', async () => {
    const user = userEvent.setup()
    const onSchedule = vi.fn()
    const onClose = vi.fn()
    const requiredAgent = {
      ...agent,
      inputs: [{ id: 'topic', label: 'Topic', required: true }],
    }
    const { rerender } = render(
      <ScheduleAgentModal
        agent={requiredAgent}
        inputs={{}}
        provider="openai"
        apiKey=""
        onSchedule={onSchedule}
        onClose={onClose}
      />
    )

    const name = screen.getByLabelText('Schedule name')
    await user.clear(name)
    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))
    expect(screen.getByText('Please give this schedule a name.')).toBeInTheDocument()

    await user.type(name, 'Nightly SEO')
    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))
    expect(screen.getByText('Fill all required inputs before scheduling.')).toBeInTheDocument()

    rerender(
      <ScheduleAgentModal
        agent={requiredAgent}
        inputs={{ topic: 'ready' }}
        provider="openai"
        apiKey=""
        onSchedule={onSchedule}
        onClose={onClose}
      />
    )
    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))
    expect(screen.getByText('An API key is required to run scheduled jobs.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Provider API key'), 'sk-live')
    await user.click(
      screen.getByRole('checkbox', {
        name: /Keep this key in session storage/i,
      })
    )
    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))
    expect(
      screen.getByText('Please check the opt-in consent for encrypted storage.')
    ).toBeInTheDocument()

    expect(service.createAutomation).not.toHaveBeenCalled()
    expect(onSchedule).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('sends trimmed values, the chosen preset, and the selected provider model', async () => {
    service.createAutomation.mockResolvedValue({})
    const user = userEvent.setup()
    const onSchedule = vi.fn()
    const onClose = vi.fn()
    renderModal({
      agent: { ...agent, inputs: [{ id: 'topic', label: 'Topic', required: true }] },
      inputs: { topic: 'ready' },
      provider: 'anthropic',
      apiKey: '  sk-ant-existing  ',
      onSchedule,
      onClose,
    })

    await user.click(screen.getByRole('button', { name: 'Every week (Mon 9:00 AM)' }))
    await user.selectOptions(screen.getByLabelText('Model'), 'claude-3-5-haiku-20241022')
    await user.click(screen.getByRole('checkbox', { name: /Email Reports/i }))
    await user.type(screen.getByLabelText('Notification email address'), '  ops@example.com  ')
    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))

    await waitFor(() => expect(service.createAutomation).toHaveBeenCalledTimes(1))
    expect(service.createAutomation).toHaveBeenCalledWith({
      name: 'SEO Agent Autopilot',
      agentId: 'seo-agent',
      agentName: 'SEO Agent',
      category: 'Marketing',
      provider: 'anthropic',
      model: 'claude-3-5-haiku-20241022',
      schedule: 'weekly',
      inputs: { topic: 'ready' },
      systemPrompt: 'Analyze SEO.',
      apiKey: 'sk-ant-existing',
      emailNotification: true,
      notificationEmail: 'ops@example.com',
    })
    expect(onSchedule).toHaveBeenCalledWith({
      label: 'SEO Agent Autopilot',
      schedule: 'weekly',
      model: 'claude-3-5-haiku-20241022',
      apiKey: 'sk-ant-existing',
      provider: 'anthropic',
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows a save failure, re-enables activation, and allows a retry', async () => {
    service.createAutomation
      .mockRejectedValueOnce(new Error('Queue is full'))
      .mockResolvedValueOnce({})
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderModal({ apiKey: 'sk-ready', onClose })

    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))
    expect(await screen.findByText('Queue is full')).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /Activate Autopilot/i })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
    expect(service.createAutomation).toHaveBeenCalledTimes(2)
  })

  it('gives the close icon button an accessible name', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderModal({ onClose })

    await user.click(screen.getByRole('button', { name: /Close schedule dialog/i }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
