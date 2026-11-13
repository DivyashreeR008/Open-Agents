import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportWorkflowAsMarkdown } from './exportMarkdown'

describe('workflow markdown export status coverage', () => {
  let blob
  let click

  beforeEach(() => {
    blob = null
    URL.createObjectURL = vi.fn((value) => {
      blob = value
      return 'blob:workflow-statuses'
    })
    URL.revokeObjectURL = vi.fn()
    click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete URL.createObjectURL
    delete URL.revokeObjectURL
  })

  it('reports a failed step without error details and a step that never started', async () => {
    exportWorkflowAsMarkdown('Nightly review', [
      { agentName: 'Fetcher', status: 'failed' },
      { agentName: 'Writer', status: 'waiting' },
      { agentName: 'Publisher', status: 'cancelled' },
    ])

    const content = await blob.text()
    expect(content).toContain('## Step 1 — Fetcher')
    expect(content).toContain('No error details were recorded.')
    expect(content).toContain('## Step 2 — Writer')
    expect(content).toContain('**Status:** Not run')
    expect(content).toContain('This step did not run')
    expect(content).toContain('**Status:** Stopped')
    expect(click).toHaveBeenCalledOnce()
  })
})
