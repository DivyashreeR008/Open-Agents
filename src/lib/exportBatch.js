/**
 * Export batch results as CSV or Markdown.
 * Mirrors the pattern in exportMarkdown.js.
 */

import { downloadBlob } from './downloadFile'

const CSV_BOM = '\uFEFF'

function slugifyFilename(name) {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '')

  return slug || 'batch'
}

function csvEscape(value) {
  let str = String(value ?? '')
  // A cell that starts with one of these characters can be interpreted as a
  // formula by spreadsheet software. Prefixing an apostrophe keeps the value
  // literal without changing the displayed text.
  if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * @param {string} agentName
 * @param {Array<{input: string, status: string, output?: string, error?: string}>} results
 */
export function exportBatchAsCSV(agentName, results) {
  const filename = `${slugifyFilename(agentName)}-batch-results.csv`

  const header = ['#', 'Input', 'Status', 'Output', 'Error']
  const safeResults = Array.isArray(results) ? results : []
  const rows = safeResults.map((r, i) => [i + 1, r.input, r.status, r.output || '', r.error || ''])

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n')

  // The byte order mark tells spreadsheet applications the file is UTF-8.
  // Without it, Windows tools fall back to a legacy local encoding and
  // non-ASCII input and output become mojibake.
  downloadBlob(CSV_BOM + csv, 'text/csv', filename)
}

/**
 * @param {string} agentName
 * @param {Array<{input: string, status: string, output?: string, error?: string}>} results
 */
export function exportBatchAsMarkdown(agentName, results) {
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const filename = `${slugifyFilename(agentName)}-batch-results.md`

  const safeResults = Array.isArray(results) ? results : []
  const sections = safeResults
    .map((r, i) => {
      const label =
        r.status === 'done'
          ? 'Success'
          : r.status === 'failed'
            ? 'Failed'
            : r.status === 'stopped'
              ? 'Stopped'
              : 'Pending'
      const heading = `## Item ${i + 1} — ${label}`
      const inputBlock = `**Input:**\n\n${r.input}`
      const bodyBlock =
        r.status === 'failed'
          ? `**Error:**\n\n${r.error || 'Unknown error'}`
          : `**Output:**\n\n${r.output || '(empty)'}`
      return `${heading}\n\n${inputBlock}\n\n${bodyBlock}`
    })
    .join('\n\n---\n\n')

  const content = `# ${agentName} — Batch Results\nGenerated on ${date}\n${safeResults.length} items processed\n\n${sections}`

  downloadBlob(content, 'text/markdown', filename)
}
