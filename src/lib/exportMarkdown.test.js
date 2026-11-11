import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportWorkflowAsMarkdown } from './exportMarkdown'

describe('exportWorkflowAsMarkdown', () => {
  let createdBlob
  let clickSpy

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0))
    createdBlob = null
    URL.createObjectURL = vi.fn((blob) => {
      createdBlob = blob
      return 'blob:workflow-test'
    })
    URL.revokeObjectURL = vi.fn()
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    delete URL.createObjectURL
    delete URL.revokeObjectURL
  })

  it('keeps only completed steps with output and renumbers them continuously', async () => {
    exportWorkflowAsMarkdown('Release workflow', [
      { agentName: 'Reviewer', status: 'done', output: 'Review complete' },
      { agentName: 'Tester', status: 'failed', output: 'Tests failed' },
      { agentName: 'Writer', status: 'done', output: 'Notes written' },
      { agentName: 'Pending', status: 'running', output: 'Still going' },
      { agentName: 'Empty', status: 'done', output: '' },
    ])

    const content = await createdBlob.text()

    expect(content).toContain('## Step 1 — Reviewer')
    expect(content).toContain('Review complete')
    expect(content).toContain('## Step 2 — Writer')
    expect(content).toContain('Notes written')
    expect(content).not.toContain('Tester')
    expect(content).not.toContain('Still going')
    expect(content).not.toContain('## Step 3')
  })

  it('writes a dated markdown document and downloads it as a blob', async () => {
    exportWorkflowAsMarkdown('Release workflow', [
      { agentName: 'Reviewer', status: 'done', output: 'Review complete' },
    ])

    expect(createdBlob.type).toBe('text/markdown;charset=utf-8')
    expect(URL.createObjectURL).toHaveBeenCalledWith(createdBlob)
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(URL.revokeObjectURL).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1000)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:workflow-test')

    const content = await createdBlob.text()
    expect(content.startsWith('# Release workflow — Workflow Output')).toBe(true)
    expect(content).toContain('Generated on 1 January 2026')
  })

  it('normalizes spaces and punctuation in the filename', () => {
    exportWorkflowAsMarkdown('Release / Workflow: Q1!', [])

    const anchor = clickSpy.mock.instances[0]
    expect(anchor).toBeInstanceOf(HTMLAnchorElement)
    expect(anchor.download).toBe('release--workflow-q1-output.md')
  })

  it('uses a workflow fallback when the title has no letters or numbers', () => {
    exportWorkflowAsMarkdown('--- / :', [])

    const anchor = clickSpy.mock.instances[0]
    expect(anchor.download).toBe('workflow-output.md')
  })

  it('still produces a valid header for an empty workflow', async () => {
    exportWorkflowAsMarkdown('Weekly review', [])

    const content = await createdBlob.text()
    expect(content).toContain('# Weekly review — Workflow Output')
    expect(content).toContain('Generated on 1 January 2026')
    expect(content).not.toContain('---')
  })
})
