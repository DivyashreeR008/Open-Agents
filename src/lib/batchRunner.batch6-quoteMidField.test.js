import { describe, expect, it } from 'vitest'
import { parseCSV } from './batchRunner'

describe('CSV parsing with a quote inside an unquoted field', () => {
  it('keeps the quote literal instead of swallowing the rest of the document', () => {
    expect(parseCSV('a"b,c\nnext,row')).toEqual({
      rows: [
        ['a"b', 'c'],
        ['next', 'row'],
      ],
    })
  })
})
