import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { loadRuns } from './automationsService'

describe('automation run malformed store', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('falls back to seed runs when stored run JSON is corrupt', () => {
    localStorage.setItem('oa_automation_runs_v2', '[broken')
    const runs = loadRuns()

    expect(Array.isArray(runs)).toBe(true)
    expect(runs.length).toBeGreaterThan(0)
    expect(runs[0]).toHaveProperty('automationId')
  })
})
