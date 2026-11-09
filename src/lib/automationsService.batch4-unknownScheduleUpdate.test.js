import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { loadAutomations, updateAutomation } from './automationsService'

describe('automation update with unknown schedule', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('keeps the previous next run time when the preset cannot be resolved', async () => {
    const nextRunAt = Date.now() + 123_456
    localStorage.setItem(
      'oa_automations_v2',
      JSON.stringify([{ id: 'auto_1', schedule: 'daily', nextRunAt }])
    )

    const updated = await updateAutomation('auto_1', { schedule: 'fortnightly' })

    expect(updated.schedule).toBe('fortnightly')
    expect(updated.nextRunAt).toBe(nextRunAt)
    expect(loadAutomations()[0].nextRunAt).toBe(nextRunAt)
  })
})
