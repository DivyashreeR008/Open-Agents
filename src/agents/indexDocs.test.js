import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { AGENT_COUNT, loadAllAgents } from './registry'

const INDEX_PATH = join(process.cwd(), 'AGENTS.md')
const TABLE_HEADING = /^\|\s*#\s*\|\s*Agent Name\s*\|\s*Description\s*\|\s*Category\s*\|$/m
const MARKER = '<!-- Add new agents above this line'

function splitCells(line) {
  const cells = []
  let current = ''

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]

    if (character === '\\' && line[index + 1] === '|') {
      current += '|'
      index += 1
      continue
    }

    if (character === '|') {
      cells.push(current.trim())
      current = ''
      continue
    }

    current += character
  }

  cells.push(current.trim())
  return cells.slice(1, -1)
}

function parseIndex(source) {
  const header = TABLE_HEADING.exec(source)
  if (!header) throw new Error('AGENTS.md is missing the agent table header')

  const markerIndex = source.indexOf(MARKER, header.index)
  if (markerIndex === -1) throw new Error('AGENTS.md is missing the new-agent marker')

  return source
    .slice(header.index, markerIndex)
    .split(/\r?\n/)
    .filter((line) => /^\|\s*\d+\s*\|/.test(line))
    .map((line) => {
      const [number, name, description, category] = splitCells(line)
      return { number, name, description, category }
    })
}

const normalize = (value) => value.replace(/\s+/g, ' ').trim()

describe('AGENTS.md agent index', () => {
  it('keeps one complete table with no stale or hidden rows', async () => {
    const source = readFileSync(INDEX_PATH, 'utf8')
    const agents = await loadAllAgents()
    const rows = parseIndex(source)
    const headers = source.match(/\|\s*#\s*\|\s*Agent Name\s*\|/g) ?? []
    const markers = source.match(/Add new agents above this line/g) ?? []

    expect(headers).toHaveLength(1)
    expect(markers).toHaveLength(1)
    expect(source.startsWith('\uFEFF')).toBe(false)
    expect(source).not.toContain('\uFFFD')
    expect(source).not.toContain('\u00EF\u00BF\u00BD')
    expect(source).not.toContain('\u00E2\u20AC\u201D')
    expect(rows).toHaveLength(AGENT_COUNT)
    expect(rows).toHaveLength(agents.length)
    expect(rows.map((row) => row.number)).toEqual(agents.map((_, index) => String(index + 1)))

    const names = new Set(rows.map((row) => row.name))
    expect(names.size).toBe(agents.length)
  }, 30000)

  it('matches every definition name, description, and category', async () => {
    const source = readFileSync(INDEX_PATH, 'utf8')
    const agents = await loadAllAgents()
    const rows = parseIndex(source)
    const agentsByName = new Map(agents.map((agent) => [agent.name, agent]))

    const problems = []

    for (const row of rows) {
      const agent = agentsByName.get(row.name)
      if (!agent) {
        problems.push(`no definition for "${row.name}"`)
        continue
      }

      if (normalize(row.description) !== normalize(agent.description)) {
        problems.push(`description drift for "${row.name}"`)
      }

      if (row.category !== agent.category) {
        problems.push(`category drift for "${row.name}"`)
      }
    }

    const indexedNames = new Set(rows.map((row) => row.name))
    for (const agent of agents) {
      if (!indexedNames.has(agent.name)) {
        problems.push(`"${agent.name}" is missing from AGENTS.md`)
      }
    }

    expect(problems, problems.join('\n')).toEqual([])
  }, 30000)
})
