import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportBatchAsMarkdown } from './exportBatch'

describe('batch markdown export status labels', () => {
  let clickSpy
  let blob

  beforeEach(() => {
    URL.createObjectURL = vi.fn((value) => {
      blob = value
      return 'blob:batch-md'
    })
    URL.revokeObjectURL = vi.fn()
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete URL.createObjectURL
    delete URL.revokeObjectURL
  })

  it('labels done, failed, stopped, and pending items with their fallbacks', async () => {
    exportBatchAsMarkdown('My Agent', [
      { input: 'a', status: 'done', output: '' },
      { input: 'b', status: 'failed', error: '' },
      { input: 'c', status: 'stopped' },
      { input: 'd', status: 'queued' },
    ])

    const text = await blob.text()
    expect(clickSpy.mock.instances[0].download).toBe('my-agent-batch-results.md')
    expect(text).toContain('## Item 1 \u2014 Success')
    expect(text).toContain('**Output:**\n\n(empty)')
    expect(text).toContain('## Item 2 \u2014 Failed')
    expect(text).toContain('**Error:**\n\nUnknown error')
    expect(text).toContain('## Item 3 \u2014 Stopped')
    expect(text).toContain('## Item 4 \u2014 Pending')
  })
})
