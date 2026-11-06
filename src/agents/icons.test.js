import { describe, expect, it } from 'vitest'
import { loadAllAgents } from './registry'
import { isKnownAgentIcon, resolveAgentIcon } from '../lib/agentIcons'
import GitHubIcon from '../components/GitHubIcon'

describe('agent icon resolution', () => {
  it('resolves every icon named by an agent definition', async () => {
    const agents = await loadAllAgents()
    const missing = agents
      .filter((agent) => agent.icon && !isKnownAgentIcon(agent.icon))
      .map((agent) => `${agent.id}: ${agent.icon}`)

    expect(missing).toEqual([])
  }, 30000)

  it('keeps the GitHub brand mark available after the lucide 1.x upgrade', () => {
    expect(isKnownAgentIcon('Github')).toBe(true)
    expect(resolveAgentIcon('Github')).toBe(GitHubIcon)
  })

  it('falls back to a bot for an unknown icon name', () => {
    expect(isKnownAgentIcon('NotARealIcon')).toBe(false)
    expect(resolveAgentIcon('NotARealIcon')).toBeTruthy()
  })
})
