export function exportWorkflowAsMarkdown(workflowTitle, steps) {
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const slug =
    workflowTitle
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '') || 'workflow'

  const filename = `${slug}-output.md`

  const stepContent = steps
    .filter((s) => s.status === 'done' && s.output)
    .map((s, i) => `## Step ${i + 1} — ${s.agentName}\n\n${s.output}`)
    .join('\n\n---\n\n')

  const content = `# ${workflowTitle} — Workflow Output\nGenerated on ${date}\n\n${stepContent}`

  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
