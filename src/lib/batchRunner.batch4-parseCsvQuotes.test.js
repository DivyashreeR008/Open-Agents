import { describe, expect, it } from 'vitest'
import { parseCSV } from './batchRunner'

describe('batch CSV quoting', () => {
  it('keeps commas and escaped quotes inside quoted fields', () => {
    expect(parseCSV('a,b\n"x,y","he said ""hi"""\n')).toEqual({
      rows: [
        ['a', 'b'],
        ['x,y', 'he said "hi"'],
      ],
    })
  })

  it('drops completely blank rows and handles a final field without a newline', () => {
    expect(parseCSV('one,two\n\nthree,four')).toEqual({
      rows: [
        ['one', 'two'],
        ['three', 'four'],
      ],
    })
  })
})
