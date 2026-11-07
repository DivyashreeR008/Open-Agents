import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportWorkflowAsMarkdown } from './exportMarkdown'

describe('markdown export without a title', () => {
  let blob
  let click

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0))
    URL.createObjectURL = vi.fn((value) => {
      blob = value
      return 'blob:missing-title'
    })
    URL.revokeObjectURL = vi.fn()
    click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    delete URL.createObjectURL
    delete URL.revokeObjectURL
  })

  it('falls back to a readable title instead of throwing', async () => {
    expect(() => exportWorkflowAsMarkdown(undefined, [])).not.toThrow()

    expect(click.mock.instances[0].download).toBe('workflow-output.md')
    expect(await blob.text()).toContain('# Workflow — Workflow Output')
  })
})
