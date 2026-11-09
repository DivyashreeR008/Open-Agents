import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportWorkflowAsMarkdown } from './exportMarkdown'

describe('workflow markdown export edge inputs', () => {
  let createdBlob
  let clickSpy

  beforeEach(() => {
    createdBlob = null
    URL.createObjectURL = vi.fn((blob) => {
      createdBlob = blob
      return 'blob:workflow-edge-test'
    })
    URL.revokeObjectURL = vi.fn()
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete URL.createObjectURL
    delete URL.revokeObjectURL
  })

  it('exports a header instead of throwing when steps is not an array', async () => {
    exportWorkflowAsMarkdown('Empty workflow', null)

    const content = await createdBlob.text()
    expect(content).toContain('# Empty workflow — Workflow Output')
    expect(content).not.toContain('## Step')
    expect(clickSpy).toHaveBeenCalledTimes(1)
  })

  it('uses an agent fallback when a completed step has no agent name', async () => {
    exportWorkflowAsMarkdown('Fallback workflow', [{ status: 'done', output: 'Finished output' }])

    const content = await createdBlob.text()
    expect(content).toContain('## Step 1 — Agent')
    expect(content).toContain('Finished output')
  })
})
