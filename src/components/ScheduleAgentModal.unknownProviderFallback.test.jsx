import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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
  id: 'fallback-agent',
  name: 'Fallback Agent',
  category: 'Research',
  systemPrompt: 'Research carefully.',
}

beforeEach(() => {
  service.createAutomation.mockReset()
  service.createAutomation.mockResolvedValue({})
})

describe('ScheduleAgentModal provider fallback', () => {
  it('uses the OpenAI model list and default when the provider is unknown', async () => {
    const user = userEvent.setup()
    const onSchedule = vi.fn()
    const onClose = vi.fn()

    render(
      <ScheduleAgentModal
        agent={agent}
        inputs={{}}
        provider="unknown-provider"
        apiKey="sk-ready"
        onSchedule={onSchedule}
        onClose={onClose}
      />
    )

    const model = screen.getByLabelText('Model')
    expect(model).toHaveValue(MODELS.openai[0].value)
    expect(Array.from(model.options).map((option) => option.value)).toEqual(
      MODELS.openai.map((entry) => entry.value)
    )

    await user.click(screen.getByRole('button', { name: /Activate Autopilot/i }))

    await waitFor(() => expect(service.createAutomation).toHaveBeenCalledTimes(1))
    expect(service.createAutomation).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'unknown-provider',
        model: MODELS.openai[0].value,
      })
    )
    expect(onSchedule).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'unknown-provider',
        model: MODELS.openai[0].value,
      })
    )
  })
})
