import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportBatchAsCSV, exportBatchAsMarkdown } from './exportBatch'

describe('batch exports with invalid result collections', () => {
  let blobs
  let clickSpy

  beforeEach(() => {
    blobs = []
    URL.createObjectURL = vi.fn((blob) => {
      blobs.push(blob)
      return `blob:batch-edge-${blobs.length}`
    })
    URL.revokeObjectURL = vi.fn()
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete URL.createObjectURL
    delete URL.revokeObjectURL
  })

  it('writes only the CSV header when results is null', async () => {
    exportBatchAsCSV('Review agent', null)

    expect(await blobs[0].text()).toBe('#,Input,Status,Output,Error')
    expect(clickSpy).toHaveBeenCalledTimes(1)
  })

  it('writes a zero-count markdown report when results is not an array', async () => {
    exportBatchAsMarkdown('Review agent', { input: 'not a list' })

    const content = await blobs[0].text()
    expect(content).toContain('0 items processed')
    expect(content).not.toContain('## Item 1')
  })
})
