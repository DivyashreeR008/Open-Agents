import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportBatchAsCSV } from './exportBatch'

describe('batch export filename fallback', () => {
  let clickSpy
  let blob

  beforeEach(() => {
    URL.createObjectURL = vi.fn((value) => {
      blob = value
      return 'blob:empty-agent'
    })
    URL.revokeObjectURL = vi.fn()
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete URL.createObjectURL
    delete URL.revokeObjectURL
  })

  it('uses the batch prefix when the agent name has no filename characters', async () => {
    exportBatchAsCSV('!!!', [{ input: 'x', status: 'done', output: 'y' }])

    expect(clickSpy.mock.instances[0].download).toBe('batch-batch-results.csv')
    expect(await blob.text()).toContain('1,x,done,y,')
  })
})
