import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportWorkflowAsMarkdown } from './exportMarkdown'

describe('workflow markdown export with a null step', () => {
  let createdBlob

  beforeEach(() => {
    createdBlob = null
    URL.createObjectURL = vi.fn((blob) => {
      createdBlob = blob
      return 'blob:workflow-null-step'
    })
    URL.revokeObjectURL = vi.fn()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete URL.createObjectURL
    delete URL.revokeObjectURL
  })

  it('skips the malformed step and keeps numbering continuous for completed steps', async () => {
    exportWorkflowAsMarkdown('Release workflow', [
      null,
      { agentName: 'Writer', status: 'done', output: 'Notes written' },
    ])

    const content = await createdBlob.text()
    expect(content).toContain('## Step 1 — Writer')
    expect(content).toContain('Notes written')
    expect(content).not.toContain('Step 2')
  })
})
