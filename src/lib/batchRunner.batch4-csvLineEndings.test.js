import { describe, expect, it } from 'vitest'
import { parseCSV } from './batchRunner'

describe('CSV line ending handling', () => {
  it('handles CRLF endings and ignores blank lines', () => {
    const result = parseCSV('name,role\r\nAda,engineer\r\n\r\nGrace,admiral\r\n')

    expect(result.rows).toEqual([
      ['name', 'role'],
      ['Ada', 'engineer'],
      ['Grace', 'admiral'],
    ])
  })
})
