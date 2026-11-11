/**
 * Export batch results as CSV or Markdown.
 * Mirrors the pattern in exportMarkdown.js.
 */

function slugifyFilename(name) {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '')

  return slug || 'batch'
}

function downloadBlob(content, mimeType, filename) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
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

  downloadBlob(csv, 'text/csv', filename)
}

/**
 * @param {string} agentName
 * @param {Array<{input: string, status: string, output?: string, error?: string}>} results
 */
const MARKDOWN_STATUS_LABELS = {
  done: 'Success',
  failed: 'Failed',
  stopped: 'Stopped',
  running: 'In progress',
  waiting: 'Not started',
  queued: 'Not started',
  pending: 'Not started',
}

const NOT_STARTED_STATUSES = new Set(['waiting', 'queued', 'pending'])

function markdownStatusLabel(status) {
  return MARKDOWN_STATUS_LABELS[status] || 'Not finished'
}

function markdownBody(result) {
  if (result.status === 'failed') {
    return `**Error:**\n\n${result.error || 'Unknown error'}`
  }
  if (result.status === 'done') {
    return `**Output:**\n\n${result.output || '(empty)'}`
  }
  if (result.status === 'stopped') {
    return '**Status note:**\n\nThis item was stopped before it finished.'
  }
  if (result.status === 'running') {
    return '**Status note:**\n\nThis item was still running when the export was created.'
  }
  if (NOT_STARTED_STATUSES.has(result.status)) {
    return '**Status note:**\n\nThis item did not start before the export was created.'
  }
  return '**Status note:**\n\nThis item did not finish, so no output is available.'
}

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
      const heading = `## Item ${i + 1} — ${markdownStatusLabel(r.status)}`
      const inputBlock = `**Input:**\n\n${r.input}`
      return `${heading}\n\n${inputBlock}\n\n${markdownBody(r)}`
    })
    .join('\n\n---\n\n')

  const content = `# ${agentName} — Batch Results\nGenerated on ${date}\n${safeResults.length} items processed\n\n${sections}`

  downloadBlob(content, 'text/markdown', filename)
}
