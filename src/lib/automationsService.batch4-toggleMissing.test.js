import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { toggleAutomation } from './automationsService'

describe('automation toggle missing record', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('oa_automations_v2', JSON.stringify([]))
  })
  afterEach(() => localStorage.clear())

  it('returns null instead of writing a new automation', async () => {
    await expect(toggleAutomation('missing')).resolves.toBeNull()
    expect(JSON.parse(localStorage.getItem('oa_automations_v2'))).toEqual([])
  })
})
