// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { loadAutomations, loadRuns } from './automationsService'

const AUTOMATIONS_KEY = 'oa_automations_v2'
const RUNS_KEY = 'oa_automation_runs_v2'

describe('automation and run seed loading', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('seeds the two starting automations on a first visit and keeps them stable', () => {
    const first = loadAutomations()

    expect(first.map((automation) => automation.id)).toEqual([
      'auto_tech_seo_daily',
      'auto_code_review_hourly',
    ])
    expect(first.every((automation) => automation.enabled && automation.hasKey)).toBe(true)
    expect(JSON.parse(localStorage.getItem(AUTOMATIONS_KEY))).toHaveLength(2)

    const second = loadAutomations()
    expect(second).toEqual(first)
  })

  it('seeds the two starter runs on a first visit', () => {
    const runs = loadRuns()

    expect(runs.map((run) => run.id)).toEqual(['run_seed_1', 'run_seed_2'])
    expect(runs.every((run) => run.status === 'success')).toBe(true)
    expect(JSON.parse(localStorage.getItem(RUNS_KEY))).toHaveLength(2)
  })

  it('falls back to the seed data when stored JSON is corrupt', () => {
    localStorage.setItem(AUTOMATIONS_KEY, '{"broken":')
    localStorage.setItem(RUNS_KEY, 'not-json')

    expect(loadAutomations()).toHaveLength(2)
    expect(loadRuns()).toHaveLength(2)
  })

  it('returns stored records unchanged when they are valid', () => {
    const automations = [{ id: 'custom', name: 'Custom job' }]
    const runs = [{ id: 'custom-run', automationId: 'custom' }]
    localStorage.setItem(AUTOMATIONS_KEY, JSON.stringify(automations))
    localStorage.setItem(RUNS_KEY, JSON.stringify(runs))

    expect(loadAutomations()).toEqual(automations)
    expect(loadRuns()).toEqual(runs)
  })
})
