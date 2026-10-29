import { describe, it, expect } from 'vitest'
import { checkSecurityRules } from '../../scripts/check-security-rules.mjs'
import fs from 'node:fs'

describe('Contributor Security Rules', () => {
  it('current codebase has zero security violations', () => {
    const { violations } = checkSecurityRules()
    expect(violations).toEqual([])
  })

  it('security-exceptions.json is valid and structured', () => {
    const raw = fs.readFileSync('security-exceptions.json', 'utf8')
    const json = JSON.parse(raw)
    expect(json).toHaveProperty('exceptions')
    expect(Array.isArray(json.exceptions)).toBe(true)
    json.exceptions.forEach((ex) => {
      expect(ex).toHaveProperty('id')
      expect(ex).toHaveProperty('rule')
      expect(ex).toHaveProperty('file')
      expect(ex).toHaveProperty('reason')
    })
  })
})

