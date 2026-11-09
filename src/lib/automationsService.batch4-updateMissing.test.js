import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { updateAutomation } from './automationsService'

describe('automation update missing record', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('oa_automations_v2', JSON.stringify([]))
  })
  afterEach(() => localStorage.clear())

  it('rejects an update for an unknown automation', async () => {
    await expect(updateAutomation('missing', { name: 'New' })).rejects.toThrow(
      'Automation not found'
    )
  })
})
