import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportWorkflowAsMarkdown } from './exportMarkdown'

describe('workflow markdown title fallback', () => {
  let clickSpy
  let blob

  beforeEach(() => {
    URL.createObjectURL = vi.fn((value) => {
      blob = value
      return 'blob:empty-title'
    })
    URL.revokeObjectURL = vi.fn()
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete URL.createObjectURL
    delete URL.revokeObjectURL
  })

  it('falls back for a non-string title instead of rendering a number', async () => {
    exportWorkflowAsMarkdown(123, [])

    expect(clickSpy.mock.instances[0].download).toBe('workflow-output.md')
    expect(await blob.text()).toContain('# Workflow — Workflow Output')
  })
})
