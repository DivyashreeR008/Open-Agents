#!/usr/bin/env node
/**
 * Sync AGENTS.md with the agent definitions in src/agents/definitions/.
 *
 * The index is generated, so this script treats the rendered table as the
 * source of truth only for row order. Field values always come from the
 * definition modules, which avoids re-parsing quoted JavaScript and keeps
 * descriptions complete.
 *
 * Usage:
 *   node scripts/sync-agents.js           rewrite AGENTS.md
 *   node scripts/sync-agents.js --check   fail when AGENTS.md is stale
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const AGENTS_PATH = join(process.cwd(), 'AGENTS.md')
const DEFINITIONS_DIR = join(process.cwd(), 'src', 'agents', 'definitions')
const TABLE_HEADING = /^\|\s*#\s*\|\s*Agent Name\s*\|\s*Description\s*\|\s*Category\s*\|$/m
const ROW_PATTERN = /^\|\s*\d+\s*\|/
const MARKER_PREFIX = '<!-- Add new agents above this line'
const MARKER = '<!-- Add new agents above this line, incrementing the number. -->'
const REQUIRED_FIELDS = ['id', 'name', 'description', 'category']

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

function parseTable(source) {
  const header = TABLE_HEADING.exec(source)
  if (!header) {
    throw new Error('Could not find the AGENTS.md table header')
  }

  const markerIndex = source.indexOf(MARKER_PREFIX, header.index)
  if (markerIndex === -1) {
    throw new Error('Could not find the "Add new agents above this line" marker')
  }

  const markerEnd = source.indexOf('-->', markerIndex)
  if (markerEnd === -1) {
    throw new Error('The AGENTS.md marker comment is not closed')
  }

  const tableSource = source.slice(header.index, markerIndex)
  const rows = tableSource
    .split(/\r?\n/)
    .filter((line) => ROW_PATTERN.test(line))
    .map((line) => {
      const [, name, description, category] = splitCells(line)
      return { name, description, category }
    })

  return {
    prefix: source.slice(0, header.index).replace(/^\uFEFF/, ''),
    rows,
    suffix: source.slice(markerEnd + 3).replace(/^\r?\n/, ''),
  }
}

async function loadDefinitions() {
  const files = readdirSync(DEFINITIONS_DIR)
    .filter((file) => file.endsWith('.js'))
    .sort()

  const agents = []

  for (const file of files) {
    const module = await import(pathToFileURL(join(DEFINITIONS_DIR, file)).href)
    const agent = module.default

    if (!agent || typeof agent !== 'object') {
      throw new Error(`${file}: definition must default-export an object`)
    }

    for (const field of REQUIRED_FIELDS) {
      if (typeof agent[field] !== 'string' || !agent[field].trim()) {
        throw new Error(`${file}: ${field} must be a non-empty string`)
      }
    }

    agents.push(agent)
  }

  return agents
}

function normalizedName(value) {
  return value.replace(/\s+/g, ' ').trim().toLowerCase()
}

function cellText(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\|/g, '\\|')
}

function renderTable(agents) {
  const headers = ['#', 'Agent Name', 'Description', 'Category']
  const rows = agents.map((agent, index) => [
    String(index + 1),
    cellText(agent.name),
    cellText(agent.description),
    cellText(agent.category),
  ])

  const widths = headers.map((header, columnIndex) =>
    Math.max(header.length, ...rows.map((row) => row[columnIndex].length))
  )

  const renderRow = (cells) =>
    `| ${cells.map((cell, index) => cell.padEnd(widths[index])).join(' | ')} |`

  return [
    renderRow(headers),
    renderRow(widths.map((width) => '-'.repeat(width))),
    ...rows.map(renderRow),
  ].join('\n')
}

function orderAgents(existingRows, agents) {
  const agentsByName = new Map()

  for (const agent of agents) {
    const key = normalizedName(agent.name)
    if (agentsByName.has(key)) {
      throw new Error(`Duplicate agent name: ${agent.name}`)
    }
    agentsByName.set(key, agent)
  }

  const ordered = []
  const included = new Set()

  for (const row of existingRows) {
    const agent = agentsByName.get(normalizedName(row.name))
    if (!agent) {
      console.warn(`Removing stale AGENTS.md row: ${row.name}`)
      continue
    }
    if (included.has(agent.name)) continue
    ordered.push(agent)
    included.add(agent.name)
  }

  const added = agents
    .filter((agent) => !included.has(agent.name))
    .sort((left, right) => {
      const dateOrder = String(left.createdAt ?? '').localeCompare(String(right.createdAt ?? ''))
      return dateOrder || left.name.localeCompare(right.name)
    })

  return { ordered: [...ordered, ...added], addedCount: added.length }
}

function buildIndex(source, agents) {
  const parsed = parseTable(source)
  const { ordered, addedCount } = orderAgents(parsed.rows, agents)
  const table = renderTable(ordered)
  const prefix = parsed.prefix.replaceAll('\u00EF\u00BF\u00BD', '-').replaceAll('\uFFFD', '-')
  const suffix = parsed.suffix ? `\n${parsed.suffix}` : '\n'

  return {
    content: `${prefix}${table}\n\n${MARKER}${suffix}`,
    addedCount,
    total: ordered.length,
  }
}

async function main() {
  const checkOnly = process.argv.includes('--check')
  const source = readFileSync(AGENTS_PATH, 'utf8')
  const agents = await loadDefinitions()
  const result = buildIndex(source, agents)

  if (checkOnly) {
    if (result.content !== source) {
      console.error(
        `AGENTS.md is out of sync with ${result.total} definitions. Run "npm run sync:agents".`
      )
      process.exitCode = 1
      return
    }

    console.log(`AGENTS.md is in sync with ${result.total} definitions.`)
    return
  }

  if (result.content !== source) {
    writeFileSync(AGENTS_PATH, result.content, 'utf8')
    console.log(`AGENTS.md synchronized: ${result.total} agents, ${result.addedCount} added.`)
    return
  }

  console.log(`AGENTS.md is already in sync with ${result.total} definitions.`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
