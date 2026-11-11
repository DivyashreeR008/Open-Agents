import { downloadBlob } from './downloadFile'

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

  const safeSteps = Array.isArray(steps) ? steps : []
  const stepContent = safeSteps
    .filter((s) => s.status === 'done' && s.output)
    .map((s, i) => `## Step ${i + 1} — ${s.agentName || 'Agent'}\n\n${s.output}`)
    .join('\n\n---\n\n')

  const content = `# ${safeTitle} — Workflow Output\nGenerated on ${date}\n\n${stepContent}`

  downloadBlob(content, 'text/markdown', filename)
}
