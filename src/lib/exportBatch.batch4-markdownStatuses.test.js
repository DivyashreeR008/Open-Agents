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

  it('labels done, failed, stopped, running, waiting, and queued items with their fallbacks', async () => {
    exportBatchAsMarkdown('My Agent', [
      { input: 'a', status: 'done', output: '' },
      { input: 'b', status: 'failed', error: '' },
      { input: 'c', status: 'stopped' },
      { input: 'd', status: 'queued' },
      { input: 'e', status: 'running' },
      { input: 'f', status: 'waiting' },
    ])

    const text = await blob.text()
    expect(clickSpy.mock.instances[0].download).toBe('my-agent-batch-results.md')
    expect(text).toContain('## Item 1 \u2014 Success')
    expect(text).toContain('**Output:**\n\n(empty)')
    expect(text).toContain('## Item 2 \u2014 Failed')
    expect(text).toContain('**Error:**\n\nUnknown error')
    expect(text).toContain('## Item 3 \u2014 Stopped')
    expect(text).toContain('This item was stopped before it finished.')
    expect(text).toContain('## Item 4 \u2014 Not started')
    expect(text).toContain('## Item 5 \u2014 In progress')
    expect(text).toContain('This item was still running when the export was created.')
    expect(text).toContain('## Item 6 \u2014 Not started')
    expect(text).toContain('This item did not start before the export was created.')
    expect(text).not.toContain('Pending')
  })
})
