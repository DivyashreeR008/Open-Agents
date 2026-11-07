import { describe, expect, it, vi } from 'vitest'

vi.mock('./definitions/abm-campaign-planner.js', () => ({
  get default() {
    throw new Error('broken definition module')
  },
}))

import { loadAllAgents } from './registry'

describe('agent registry load failure recovery', () => {
  it('rejects the first load and retries instead of caching the failure', async () => {
    await expect(loadAllAgents()).rejects.toThrow('broken definition module')
    await expect(loadAllAgents()).rejects.toThrow('broken definition module')
  })
})
