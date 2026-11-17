import { describe, expect, it } from 'vitest'
import { isKnownAgentIcon, resolveAgentIcon } from './agentIcons'
import { suites } from '../suites/suitesData'

const definitionModules = import.meta.glob('../agents/definitions/*.js', {
  eager: true,
  import: 'default',
})

const definitions = Object.entries(definitionModules)

describe('agent icon explicit map coverage', () => {
  it('resolves every icon published by an agent definition', () => {
    for (const [file, agent] of definitions) {
      expect(isKnownAgentIcon(agent.icon), `${file} uses ${agent.icon}`).toBe(true)
      expect(resolveAgentIcon(agent.icon), `${file} uses ${agent.icon}`).toBeTruthy()
    }
  })

  it('resolves every icon used by a suite card', () => {
    for (const suite of suites) {
      expect(isKnownAgentIcon(suite.icon), `${suite.id} uses ${suite.icon}`).toBe(true)
    }
  })

  it('keeps the fallback for names that are not in the explicit map', () => {
    expect(resolveAgentIcon('Teapot')).toBe(resolveAgentIcon(''))
    expect(isKnownAgentIcon('Teapot')).toBe(false)
  })
})
