// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createAutomation, getAutomation, updateAutomation } from './automationsService'

const NOW = Date.UTC(2026, 10, 7, 9, 0, 0)
const DAY = 24 * 60 * 60 * 1000

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('oa_automations_v2', '[]')
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
  localStorage.clear()
})

describe('unknown schedule fallbacks', () => {
  it('creates a daily automation when the requested schedule is unknown', async () => {
    const created = await createAutomation({
      name: 'Unknown schedule',
      agentId: '1',
      agentName: 'Agent',
      schedule: 'every-fortnight',
    })

    expect(created.schedule).toBe('every-fortnight')
    expect(created.cron).toBe('0 9 * * *')
    expect(created.nextRunAt).toBe(NOW + DAY)
  })

  it('does not change cron or nextRunAt when updating to an unknown schedule', async () => {
    const created = await createAutomation({
      name: 'Daily',
      agentId: '1',
      agentName: 'Agent',
      schedule: 'daily',
    })

    const updated = await updateAutomation(created.id, { schedule: 'every-fortnight' })

    expect(updated.schedule).toBe('every-fortnight')
    expect(updated.cron).toBe('0 9 * * *')
    expect(updated.nextRunAt).toBe(created.nextRunAt)
  })

  it('starts a new daily schedule when a paused automation resumes without a valid next run', async () => {
    localStorage.setItem(
      'oa_automations_v2',
      JSON.stringify([
        {
          id: 'paused',
          name: 'Paused job',
          agentId: '1',
          agentName: 'Agent',
          schedule: 'daily',
          enabled: false,
          nextRunAt: NOW - DAY,
        },
      ])
    )

    const updated = await updateAutomation('paused', { enabled: true })

    expect(updated.enabled).toBe(true)
    expect(updated.nextRunAt).toBe(NOW + DAY)
    expect(getAutomation('paused').nextRunAt).toBe(NOW + DAY)
  })
})
