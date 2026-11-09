import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportBatchAsCSV } from './exportBatch'

describe('batch CSV formula injection defence', () => {
  let createdBlob
  let clickSpy

  beforeEach(() => {
    createdBlob = null
    URL.createObjectURL = vi.fn((blob) => {
      createdBlob = blob
      return 'blob:csv-injection-test'
    })
    URL.revokeObjectURL = vi.fn()
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete URL.createObjectURL
    delete URL.revokeObjectURL
  })

  it('prefixes spreadsheet formula starts so exported cells stay literal', async () => {
    exportBatchAsCSV('Review agent', [
      {
        input: '=HYPERLINK("https://example.test","click")',
        status: 'done',
        output: '+SUM(A1:A2)',
        error: '@import',
      },
      {
        input: '-2+3',
        status: 'failed',
        output: '\tstartsWithTab',
        error: '\rStartsWithCarriageReturn',
      },
      {
        input: 'ordinary text',
        status: 'done',
        output: 'ordinary output',
        error: '',
      },
    ])

    const content = await createdBlob.text()

    expect(content).toContain("'=HYPERLINK")
    expect(content).toContain("'+SUM(A1:A2)")
    expect(content).toContain("'@import")
    expect(content).toContain("'-2+3")
    expect(content).toContain("'\tstartsWithTab")
    expect(content).toContain('"\'\rStartsWithCarriageReturn"')
    expect(content).toContain('3,ordinary text,done,ordinary output,')
    expect(clickSpy).toHaveBeenCalledTimes(1)
  })
})
