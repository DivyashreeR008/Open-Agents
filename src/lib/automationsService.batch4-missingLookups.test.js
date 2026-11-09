import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getAutomation, getRunsForAutomation } from './automationsService'

describe('automation lookup misses', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('oa_automations_v2', JSON.stringify([{ id: 'auto_1' }]))
    localStorage.setItem(
      'oa_automation_runs_v2',
      JSON.stringify([
        { id: 'run_1', automationId: 'auto_1' },
        { id: 'run_2', automationId: 'other' },
      ])
    )
  })
  afterEach(() => localStorage.clear())

  it('returns null for an unknown automation and filters runs by id', () => {
    expect(getAutomation('missing')).toBeNull()
    expect(getRunsForAutomation('auto_1').map((run) => run.id)).toEqual(['run_1'])
    expect(getRunsForAutomation('missing')).toEqual([])
  })
})
