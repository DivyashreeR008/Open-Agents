import { describe, expect, it } from 'vitest'
import { parseCSV } from './batchRunner'

describe('CSV parser unterminated quote', () => {
  it('keeps the quoted payload instead of dropping the row', () => {
    expect(parseCSV('name,notes\n"Ada, Lovelace')).toEqual({
      rows: [['name', 'notes'], ['Ada, Lovelace']],
    })
  })
})
