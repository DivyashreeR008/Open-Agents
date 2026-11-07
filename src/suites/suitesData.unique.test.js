import { describe, expect, it } from 'vitest'
import { suites } from './suitesData'

describe('suite registry identity', () => {
  it('keeps suite ids and names unique', () => {
    const ids = suites.map((suite) => suite.id)
    const names = suites.map((suite) => suite.name)

    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(names).size).toBe(names.length)
    expect(ids.every((id) => /^[a-z0-9-]+$/.test(id))).toBe(true)
  })
})
