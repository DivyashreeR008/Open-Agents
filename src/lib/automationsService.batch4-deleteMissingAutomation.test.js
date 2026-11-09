import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { deleteAutomation, loadAutomations } from './automationsService'

describe('automation delete missing record', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('returns true and preserves the other automations', async () => {
    localStorage.setItem('oa_automations_v2', JSON.stringify([{ id: 'auto_1', name: 'Keep me' }]))

    await expect(deleteAutomation('missing')).resolves.toBe(true)
    expect(loadAutomations()).toEqual([{ id: 'auto_1', name: 'Keep me' }])
  })
})
