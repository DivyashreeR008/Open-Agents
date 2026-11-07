import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScheduleAgentModal from './ScheduleAgentModal'

const service = vi.hoisted(() => ({ createAutomation: vi.fn() }))

vi.mock('../lib/automationsService', () => ({
  SCHEDULE_PRESETS: [
    { value: 'hourly', label: 'Every hour' },
    { value: 'daily', label: 'Every day' },
    { value: 'weekly', label: 'Every week' },
  ],
  createAutomation: service.createAutomation,
}))

const agent = {
  id: 'tag-agent',
  name: 'Tag Agent',
  category: 'Data Science',
  systemPrompt: 'Tag the records.',
  inputs: [{ id: 'tags', label: 'Tags', required: true }],
}

beforeEach(() => {
  service.createAutomation.mockReset()
  service.createAutomation.mockResolvedValue({})
})

describe('ScheduleAgentModal array requirements and email validation', () => {
  it('rejects an empty required array, then requires a recipient before email reports', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <ScheduleAgentModal
        agent={agent}
        inputs={{ tags: [] }}
        provider="openai"
        apiKey="sk-live"
        onSchedule={vi.fn()}
        onClose={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))
    expect(screen.getByText('Fill all required inputs before scheduling.')).toBeInTheDocument()

    rerender(
      <ScheduleAgentModal
        agent={agent}
        inputs={{ tags: ['priority'] }}
        provider="openai"
        apiKey="sk-live"
        onSchedule={vi.fn()}
        onClose={vi.fn()}
      />
    )

    await user.click(screen.getByRole('checkbox', { name: /Email Reports/i }))
    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))
    expect(screen.getByText('Please enter a recipient email address.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Notification email address'), 'ops@example.com')
    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))

    await waitFor(() => expect(service.createAutomation).toHaveBeenCalledTimes(1))
    expect(service.createAutomation).toHaveBeenCalledWith(
      expect.objectContaining({
        inputs: { tags: ['priority'] },
        emailNotification: true,
        notificationEmail: 'ops@example.com',
      })
    )
  })
})
