import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportBatchAsCSV } from './exportBatch'

describe('batch CSV formula injection after a leading newline', () => {
  let createdBlob

  beforeEach(() => {
    createdBlob = null
    URL.createObjectURL = vi.fn((blob) => {
      createdBlob = blob
      return 'blob:batch6-newline-formula'
    })
    URL.revokeObjectURL = vi.fn()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete URL.createObjectURL
    delete URL.revokeObjectURL
  })

  it('prefixes a formula that starts on the second line of a cell', async () => {
    exportBatchAsCSV('Review agent', [{ input: '\n=1+1', status: 'done', output: '\n@SUM(A1:A2)' }])

    const content = await createdBlob.text()
    expect(content).toContain(`"'\n=1+1"`)
    expect(content).toContain(`"'\n@SUM(A1:A2)"`)
  })
})
