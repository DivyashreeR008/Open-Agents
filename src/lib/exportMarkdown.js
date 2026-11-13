export function exportWorkflowAsMarkdown(workflowTitle, steps) {
  const safeTitle =
    typeof workflowTitle === 'string' && workflowTitle.trim() ? workflowTitle : 'Workflow'
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const slug =
    safeTitle
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '') || 'workflow'

  const filename = `${slug}-output.md`

  const safeSteps = Array.isArray(steps) ? steps.filter(Boolean) : []

  const statusLabel = (status) =>
    ({
      done: 'Completed',
      failed: 'Failed',
      running: 'Still running',
      cancelled: 'Stopped',
      skipped: 'Skipped',
    })[status] || 'Not run'

  const stepBody = (step) => {
    if (step.status === 'failed') {
      const detail = step.error || 'No error details were recorded.'
      return step.output
        ? `**Error:**\n\n${detail}\n\n**Partial output:**\n\n${step.output}`
        : `**Error:**\n\n${detail}`
    }

    if (step.status === 'done') {
      return `**Output:**\n\n${step.output || '(empty)'}`
    }

    if (step.status === 'running') {
      return 'This step was still running when the export was created.'
    }

    return 'This step did not run before the export was created.'
  }

  const stepContent = safeSteps
    .map(
      (step, i) =>
        `## Step ${i + 1} — ${step.agentName || 'Agent'}\n\n**Status:** ${statusLabel(step.status)}\n\n${stepBody(step)}`
    )
    .join('\n\n---\n\n')

  const content = `# ${safeTitle} — Workflow Output\nGenerated on ${date}\n\n${stepContent}`

  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
