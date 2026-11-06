import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportBatchAsCSV, exportBatchAsMarkdown } from './exportBatch'

describe('batch result exports', () => {
  let createdBlob
  let clickSpy

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0))
    createdBlob = null
    URL.createObjectURL = vi.fn((blob) => {
      createdBlob = blob
      return 'blob:batch-test'
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

  it('writes CSV with stable columns, row order, and empty missing values', async () => {
    exportBatchAsCSV('Review agent', [
      { input: 'plain input', status: 'done', output: 'plain output' },
      { input: 'pending input', status: 'pending' },
    ])

    const content = await createdBlob.text()
    expect(content).toBe(
      [
        '#,Input,Status,Output,Error',
        '1,plain input,done,plain output,',
        '2,pending input,pending,,',
      ].join('\n')
    )
    expect(createdBlob.type).toBe('text/csv')
  })

  it('quotes commas, quotes, newlines, and carriage returns', async () => {
    exportBatchAsCSV('Review agent', [
      {
        input: 'He said "hi", then left\r\nnext line',
        status: 'failed',
        error: 'Line one\nLine two',
      },
    ])

    const content = await createdBlob.text()
    expect(content).toContain(
      '1,"He said ""hi"", then left\r\nnext line",failed,,"Line one\nLine two"'
    )
  })

  it('normalizes the filename and revokes the object URL', () => {
    exportBatchAsCSV('My / Agent: Batch!', [])

    const anchor = clickSpy.mock.instances[0]
    expect(anchor.download).toBe('my--agent-batch-batch-results.csv')
    expect(URL.createObjectURL).toHaveBeenCalledWith(createdBlob)
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:batch-test')
  })

  it('uses a batch fallback when the agent name has no usable characters', () => {
    exportBatchAsCSV('---', [])

    expect(clickSpy.mock.instances[0].download).toBe('batch-batch-results.csv')
  })

  it('labels done, failed, stopped, and pending markdown sections', async () => {
    exportBatchAsMarkdown('Review agent', [
      { input: 'first', status: 'done', output: 'first output' },
      { input: 'second', status: 'failed', error: 'provider error' },
      { input: 'third', status: 'stopped' },
      { input: 'fourth', status: 'pending' },
    ])

    const content = await createdBlob.text()

    expect(content).toContain('# Review agent — Batch Results')
    expect(content).toContain('Generated on 1 January 2026')
    expect(content).toContain('4 items processed')
    expect(content).toContain('## Item 1 — Success')
    expect(content).toContain('## Item 2 — Failed')
    expect(content).toContain('**Error:**\n\nprovider error')
    expect(content).toContain('## Item 3 — Stopped')
    expect(content).toContain('## Item 4 — Pending')
    expect(createdBlob.type).toBe('text/markdown')
  })

  it('uses an empty-output marker and a fallback error message', async () => {
    exportBatchAsMarkdown('Review agent', [
      { input: 'first', status: 'done' },
      { input: 'second', status: 'failed' },
    ])

    const content = await createdBlob.text()
    expect(content).toContain('**Output:**\n\n(empty)')
    expect(content).toContain('**Error:**\n\nUnknown error')
  })

  it('still writes a valid markdown document for an empty batch', async () => {
    exportBatchAsMarkdown('Review agent', [])

    const content = await createdBlob.text()
    expect(content).toContain('# Review agent — Batch Results')
    expect(content).toContain('0 items processed')
  })
})
