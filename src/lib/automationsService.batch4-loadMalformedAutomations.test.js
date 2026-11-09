import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { loadAutomations } from './automationsService'

describe('automation malformed store', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('falls back to the seed list when stored automation JSON is corrupt', () => {
    localStorage.setItem('oa_automations_v2', '{broken')
    const automations = loadAutomations()

    expect(Array.isArray(automations)).toBe(true)
    expect(automations.length).toBeGreaterThan(0)
    expect(automations[0]).toHaveProperty('id')
  })
})
