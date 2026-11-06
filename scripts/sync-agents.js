#!/usr/bin/env node
/**
 * Sync AGENTS.md with agent definitions in src/agents/definitions/
 *
 * Reads all agent definition files and generates/updates the AGENTS.md
 * markdown table ensuring it stays in sync with the actual agents.
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// Read AGENTS.md current content
const agentsMdPath = join(process.cwd(), 'AGENTS.md')
let agentsMdContent = ''

if (existsSync(agentsMdPath)) {
  agentsMdContent = readFileSync(agentsMdPath, 'utf-8')
}

// Parse existing AGENTS.md to find the table start/end
const tableStartMarker = '| # | Agent Name | Description | Category |'
let tableStartIdx = agentsMdContent.indexOf(tableStartMarker)

if (tableStartIdx === -1) {
  console.error('ERROR: Could not find AGENTS.md table marker')
  process.exit(1)
}

// Find the table - look for the header row and data rows
const tableHeaderLineIdx = agentsMdContent.indexOf('\n|---|', tableStartIdx)
if (tableHeaderLineIdx === -1) {
  console.error('ERROR: Could not find table header in AGENTS.md')
  process.exit(1)
}

// Find where the table ends (next major section or end of file)
const afterTable = agentsMdContent.substring(tableHeaderLineIdx + 1)
const nextSectionIdx = afterTable.search(/^#+\s/im)
const tableEndIdx =
  nextSectionIdx !== -1
    ? tableStartIdx + tableHeaderLineIdx + 1 + nextSectionIdx
    : agentsMdContent.length
const currentTable = agentsMdContent.substring(tableStartIdx, tableEndIdx)

// Parse existing entries from the table
const existingEntries = new Set()
const entryRegex = /^\|\s*\d+\s*\|\s*([^\|]+)\s*\|\s*([^\|]+)\s*\|\s*([^\|]+)\s*\|/gm
let match
while ((match = entryRegex.exec(currentTable)) !== null) {
  const id = match[1].trim()
  existingEntries.add(id)
}

// Scan all agent definition files
const definitionsDir = join(process.cwd(), 'src', 'agents', 'definitions')
const definitionFiles = readdirSync(definitionsDir).filter((f) => f.endsWith('.js'))

const newEntries = []

for (const file of definitionFiles) {
  const filePath = join(definitionsDir, file)
  const content = readFileSync(filePath, 'utf-8')

  // Extract the default export object
  const idMatch = content.match(/id:\s*"([^"]+)"/)
  const nameMatch = content.match(/name:\s*"([^"]+)"/)
  const descMatch = content.match(/description:\s*"([^"]+)"/)
  const categoryMatch = content.match(/category:\s*"([^"]+)"/)

  if (idMatch) {
    const id = idMatch[1]
    const name = nameMatch
      ? nameMatch[1]
      : id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    const description = descMatch ? descMatch[1] : ''
    const category = categoryMatch ? categoryMatch[1] : 'Engineering'

    // Skip if already exists
    if (existingEntries.has(id)) {
      continue
    }

    // Format the entry for AGENTS.md
    const safeName = name.replace(/"/g, '').trim()
    const safeDesc = description.replace(/"/g, '').trim().split('.')[0] // First sentence
    const safeCat = category.replace(/"/g, '').trim()

    newEntries.push({
      id,
      name: safeName,
      description: safeDesc,
      category: safeCat,
    })
  }
}

// Generate new table rows
const newRows = newEntries
  .map(
    (entry) =>
      `| ${newEntries.indexOf(entry) + 1} | ${entry.name} | ${entry.description} | ${entry.category} |`
  )
  .join('\n')

// Insert new entries before the footer comment
const footerIdx = currentTable.lastIndexOf('<!--')
const insertIdx = footerIdx !== -1 ? currentTable.lastIndexOf('-->') : currentTable.length
const updatedTable =
  currentTable.slice(0, insertIdx) + '\n' + newRows + currentTable.slice(insertIdx)

// Replace the table in the full AGENTS.md
const newAgentsMd = agentsMdContent.replace(currentTable, updatedTable)

// Write the updated AGENTS.md
writeFileSync(agentsMdPath, newAgentsMd, 'utf-8')

console.log(`✅ AGENTS.md synchronized: added ${newEntries.length} new agent entries`)
console.log(
  `📊 Total entries should now match the ${definitionFiles.length} agent definition files`
)
