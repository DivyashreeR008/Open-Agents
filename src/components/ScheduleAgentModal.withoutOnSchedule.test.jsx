import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScheduleAgentModal from './ScheduleAgentModal'

const service = vi.hoisted(() => ({ createAutomation: vi.fn() }))

vi.mock('../lib/automationsService', () => ({
  SCHEDULE_PRESETS: [{ value: 'daily', label: 'Every day (9:00 AM)' }],
  createAutomation: service.createAutomation,
}))

const agent = {
  id: 'brief-agent',
  name: 'Brief Agent',
  category: 'Marketing',
  systemPrompt: 'Write briefs.',
}

beforeEach(() => {
  service.createAutomation.mockReset()
  service.createAutomation.mockResolvedValue({ id: 'auto_1' })
})

describe('ScheduleAgentModal without an onSchedule callback', () => {
  it('creates the automation and closes without requiring a callback', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <ScheduleAgentModal
        agent={agent}
        inputs={{}}
        provider="openai"
        apiKey="sk-ready"
        onClose={onClose}
      />
    )

    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))

    await waitFor(() => expect(service.createAutomation).toHaveBeenCalledTimes(1))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
