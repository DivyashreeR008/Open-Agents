import { describe, it, expect } from 'vitest'
import { assertUniqueAgentIds, loadAllAgents } from './registry'
import { CATEGORIES } from './categories'

const definitionModules = import.meta.glob('./definitions/*.js', {
  eager: true,
  import: 'default',
})

const definitions = Object.entries(definitionModules).map(([file, agent]) => ({
  file,
  agent,
}))

const SUPPORTED_OUTPUT_TYPES = new Set(['markdown', 'text', 'json'])

describe('loadAllAgents', () => {
  it('should load all agent definitions', async () => {
    const agents = await loadAllAgents()
    expect(Array.isArray(agents)).toBe(true)
    expect(agents.length).toBeGreaterThan(0)
  }, 30000)

  it('every agent should have required fields', async () => {
    const agents = await loadAllAgents()
    agents.forEach((agent) => {
      expect(agent).toHaveProperty('id')
      expect(agent).toHaveProperty('name')
      expect(agent).toHaveProperty('description')
      expect(agent).toHaveProperty('category')
      expect(agent).toHaveProperty('inputs')
      expect(typeof agent.id).toBe('string')
      expect(typeof agent.name).toBe('string')
      expect(Array.isArray(agent.inputs)).toBe(true)
    })
  })

  it('every agent id should be unique', async () => {
    const agents = await loadAllAgents()
    const ids = agents.map((a) => a.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('every agent id should be kebab-case', async () => {
    const agents = await loadAllAgents()
    const kebabRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/
    agents.forEach((agent) => {
      expect(agent.id).toMatch(kebabRegex)
    })
  })

  it('every agent should have a valid category', async () => {
    const agents = await loadAllAgents()
    agents.forEach((agent) => {
      expect(CATEGORIES).toContain(agent.category)
    })
  })

  it('should return the same cached result on subsequent calls', async () => {
    const first = await loadAllAgents()
    const second = await loadAllAgents()
    expect(first).toBe(second)
  })
})

describe('definition source integrity', () => {
  it('gives every definition an id that matches its filename', () => {
    const mismatches = definitions
      .filter(({ file, agent }) => {
        const filename = file.split('/').pop().replace(/\.js$/, '')
        return agent?.id !== filename
      })
      .map(({ file, agent }) => `${file}: declares "${agent?.id ?? '(missing)'}"`)

    expect(mismatches).toEqual([])
  })

  it('keeps every raw definition id unique', () => {
    expect(() =>
      assertUniqueAgentIds(definitions.map(({ agent }) => agent))
    ).not.toThrow()
  })

  it('declares a supported outputType on every definition', () => {
    const invalid = definitions
      .filter(({ agent }) => !SUPPORTED_OUTPUT_TYPES.has(agent?.outputType))
      .map(({ file, agent }) => `${file}: ${agent?.outputType ?? '(missing)'}`)

    expect(invalid).toEqual([])
  })
})

describe('assertUniqueAgentIds', () => {
  it('throws with every colliding id named once', () => {
    expect(() =>
      assertUniqueAgentIds([
        { id: 'alpha' },
        { id: 'alpha' },
        { id: 'beta' },
        { id: 'gamma' },
        { id: 'gamma' },
      ])
    ).toThrow('Duplicate agent ids: alpha, gamma.')
  })

  it('ignores entries without an id and returns the original array', () => {
    const agents = [{ id: 'alpha' }, {}, null]
    expect(assertUniqueAgentIds(agents)).toBe(agents)
  })
})
