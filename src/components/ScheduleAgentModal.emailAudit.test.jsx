import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScheduleAgentModal from './ScheduleAgentModal'
import { MODELS } from '../lib/resolveAgentModel'

const service = vi.hoisted(() => ({ createAutomation: vi.fn() }))

vi.mock('../lib/automationsService', () => ({
  SCHEDULE_PRESETS: [
    { value: 'hourly', label: 'Every hour' },
    { value: 'daily', label: 'Every day (9:00 AM)' },
    { value: 'weekly', label: 'Every week (Mon 9:00 AM)' },
  ],
  createAutomation: service.createAutomation,
}))

const agent = {
  id: 'audit-agent',
  name: 'Audit Agent',
  category: 'Research',
  systemPrompt: 'Audit carefully.',
  inputs: [
    { id: 'topic', label: 'Topic', required: true },
    { id: 'notes', label: 'Notes', required: false },
    { id: 'tags', label: 'Tags', type: 'multiselect', required: false },
  ],
}

function renderModal(props = {}) {
  return render(
    <ScheduleAgentModal
      agent={agent}
      inputs={{ topic: '  climate  ', notes: '   ', tags: [] }}
      provider="openai"
      apiKey="sk-live"
      onSchedule={vi.fn()}
      onClose={vi.fn()}
      {...props}
    />
  )
}

beforeEach(() => {
  service.createAutomation.mockReset()
  service.createAutomation.mockResolvedValue({})
})

describe('ScheduleAgentModal email accessibility and audit coverage', () => {
  it('associates the email field with its label, hint, and validation message', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderModal({ onClose })

    await user.click(screen.getByRole('checkbox', { name: /Email Reports/i }))
    const email = screen.getByLabelText('Notification email address')

    expect(email).toHaveAttribute('type', 'email')
    expect(email).toHaveAttribute('name', 'email')
    expect(email).toHaveAttribute('autocomplete', 'email')
    expect(email).toHaveAttribute('aria-describedby', expect.stringContaining('email'))

    await user.type(email, 'not-an-email')
    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid recipient email address.')
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveAttribute('aria-describedby', expect.stringContaining('error'))
    expect(service.createAutomation).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()

    await user.clear(email)
    await user.type(email, 'ops@example.com')
    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))

    await waitFor(() => expect(service.createAutomation).toHaveBeenCalledTimes(1))
    expect(service.createAutomation).toHaveBeenCalledWith(
      expect.objectContaining({ notificationEmail: 'ops@example.com' })
    )
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('counts only filled inputs, defaults the name and model, and exposes a named dialog', () => {
    const { container } = renderModal()

    expect(screen.getByRole('dialog', { name: 'Schedule Agent Autopilot' })).toBeInTheDocument()
    expect(screen.getByLabelText('Schedule name')).toHaveValue('Audit Agent Autopilot')
    expect(screen.getByLabelText('Model')).toHaveValue(MODELS.openai[0].value)
    expect(screen.getByText('1 input(s) configured')).toBeInTheDocument()
    expect(container.querySelectorAll('svg[aria-hidden="true"]').length).toBeGreaterThan(0)
  })

  it('closes on Escape and does not notify the parent when persistence fails', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    service.createAutomation.mockRejectedValueOnce(new Error('Queue is full'))
    renderModal({ onClose, onSchedule: vi.fn() })

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)

    onClose.mockClear()
    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))
    expect(await screen.findByText('Queue is full')).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /Activate Autopilot/i })).toBeEnabled()
  })
})
