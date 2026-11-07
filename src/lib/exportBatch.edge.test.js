import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportBatchAsCSV, exportBatchAsMarkdown } from './exportBatch'

describe('batch export edge payloads', () => {
  let createdBlob
  let clickSpy

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0))
    createdBlob = null
    URL.createObjectURL = vi.fn((blob) => {
      createdBlob = blob
      return 'blob:edge-test'
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

  it('writes only the header for an empty batch and falls back on an empty name', async () => {
    exportBatchAsCSV('', [])

    const content = await createdBlob.text()
    expect(content).toBe('#,Input,Status,Output,Error')
    expect(clickSpy.mock.instances[0].download).toBe('batch-batch-results.csv')
  })

  it('renders null and undefined fields as empty cells instead of their names', async () => {
    exportBatchAsCSV('Review agent', [
      { input: null, status: undefined, output: null, error: null },
    ])

    const content = await createdBlob.text()
    expect(content).toBe('#,Input,Status,Output,Error\n1,,,,')
    expect(content).not.toContain('null')
    expect(content).not.toContain('undefined')
  })

  it('labels an unrecognized status as pending and falls back for an empty agent name', async () => {
    exportBatchAsMarkdown('', [{ input: 'later', status: 'queued', output: 'waiting' }])

    const content = await createdBlob.text()
    expect(content).toContain('#  — Batch Results')
    expect(content).toContain('## Item 1 — Pending')
    expect(clickSpy.mock.instances[0].download).toBe('batch-batch-results.md')
  })
})
