import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { deleteRun, loadRuns } from './automationsService'

describe('automation delete missing run', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(
      'oa_automation_runs_v2',
      JSON.stringify([{ id: 'run_1', automationId: 'auto_1' }])
    )
  })
  afterEach(() => localStorage.clear())

  it('keeps existing runs when the requested id is absent', () => {
    deleteRun('missing')
    expect(loadRuns()).toEqual([{ id: 'run_1', automationId: 'auto_1' }])
  })
})
