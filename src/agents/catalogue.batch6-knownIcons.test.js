import { describe, expect, it } from 'vitest'

import { isKnownAgentIcon } from '../lib/agentIcons'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent catalogue icons', () => {
  it('resolves every icon name to a real icon or the documented fallback', () => {
    for (const agent of agents) {
      expect(typeof agent.icon, agent.id).toBe('string')
      expect(isKnownAgentIcon(agent.icon), agent.id + ': ' + agent.icon).toBe(true)
    }
  })
})
