import { describe, expect, it, vi } from 'vitest'

vi.mock('./definitions/abm-campaign-planner.js', () => ({
  get default() {
    throw new Error('broken definition module')
  },
}))

import { AGENT_COUNT, loadAllAgents } from './registry'

describe('agent registry load failure recovery', () => {
  it('keeps the healthy definitions when one module fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const agents = await loadAllAgents()

    expect(agents).toHaveLength(AGENT_COUNT - 1)
    expect(agents.some((agent) => agent.id === 'abm-campaign-planner')).toBe(false)
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('abm-campaign-planner'),
      expect.any(Error)
    )
  })

  it('caches the partial catalogue instead of reloading every module', async () => {
    const first = await loadAllAgents()
    const second = await loadAllAgents()

    expect(second).toBe(first)
  })
})
