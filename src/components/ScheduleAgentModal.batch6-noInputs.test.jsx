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

beforeEach(() => {
  service.createAutomation.mockReset()
  service.createAutomation.mockResolvedValue({})
})

describe('ScheduleAgentModal without inputs', () => {
  it('schedules an agent whose definition has no input fields', async () => {
    const user = userEvent.setup()
    const onSchedule = vi.fn()
    const onClose = vi.fn()
    render(
      <ScheduleAgentModal
        agent={{ id: 'ping', name: 'Ping', category: 'Ops', systemPrompt: 'Ping.', inputs: [] }}
        inputs={{}}
        provider="openai"
        apiKey="sk-live"
        onSchedule={onSchedule}
        onClose={onClose}
      />
    )

    expect(screen.getByText('0 input(s) configured')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))
    await waitFor(() => expect(service.createAutomation).toHaveBeenCalledOnce())
    expect(service.createAutomation).toHaveBeenCalledWith(
      expect.objectContaining({ agentId: 'ping', inputs: {} })
    )
    expect(onSchedule).toHaveBeenCalledOnce()
    expect(onClose).toHaveBeenCalledOnce()
  })
})
