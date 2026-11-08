import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScheduleAgentModal from './ScheduleAgentModal'

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
  id: 'fallback-agent',
  name: 'Fallback Agent',
  category: 'Research',
  systemPrompt: 'Research carefully.',
}

beforeEach(() => {
  service.createAutomation.mockReset()
})

describe('ScheduleAgentModal save failure fallback', () => {
  it('shows a generic message when the rejection carries no message', async () => {
    const user = userEvent.setup()
    service.createAutomation.mockRejectedValue('queue unavailable')

    render(
      <ScheduleAgentModal
        agent={agent}
        inputs={{}}
        provider="openai"
        apiKey="sk-ready"
        onSchedule={vi.fn()}
        onClose={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))

    expect(await screen.findByText('Failed to save automation')).toBeInTheDocument()
  })
})
