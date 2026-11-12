import { describe, expect, it } from 'vitest'
import { parseCSV } from './batchRunner'

describe('parseCSV quoted empty fields', () => {
  it('keeps a quoted empty field between two populated cells', () => {
    expect(parseCSV('first,"",third\n')).toEqual({ rows: [['first', '', 'third']] })
  })

  it('keeps an escaped quote next to an empty field', () => {
    expect(parseCSV('"a""b",\n')).toEqual({ rows: [['a"b', '']] })
  })
})
