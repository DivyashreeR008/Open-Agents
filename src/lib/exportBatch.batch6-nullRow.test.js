import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportBatchAsCSV, exportBatchAsMarkdown } from './exportBatch'

describe('batch exports with malformed rows and names', () => {
  let createdBlob
  let clickSpy

  beforeEach(() => {
    createdBlob = null
    URL.createObjectURL = vi.fn((blob) => {
      createdBlob = blob
      return 'blob:batch6-null-row'
    })
    URL.revokeObjectURL = vi.fn()
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete URL.createObjectURL
    delete URL.revokeObjectURL
  })

  it('keeps row numbering when a CSV result is null', async () => {
    exportBatchAsCSV('Review agent', [{ input: 'valid', status: 'done', output: 'ok' }, null])

    const content = await createdBlob.text()
    expect(content.split('\n')[1]).toBe('1,valid,done,ok,')
    expect(content.split('\n')[2]).toBe('2,,,,')
    expect(clickSpy).toHaveBeenCalledTimes(1)
  })

  it('renders a null markdown result as an empty pending item', async () => {
    exportBatchAsMarkdown('Review agent', [null, { input: 'valid', status: 'done', output: 'ok' }])

    const content = await createdBlob.text()
    expect(content).toContain('## Item 1 — Pending')
    expect(content).toContain('## Item 2 — Success')
    expect(content).toContain('valid')
  })

  it('falls back to the batch filename when the agent name is not a string', () => {
    exportBatchAsCSV(null, [])

    expect(clickSpy.mock.instances[0].download).toBe('batch-batch-results.csv')
  })
})
