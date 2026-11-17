import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const securityTxt = readFileSync('public/.well-known/security.txt', 'utf8')
const securityPolicy = readFileSync('SECURITY.md', 'utf8')

const fields = new Map(
  securityTxt
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const separator = line.indexOf(':')
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
    })
)

describe('security.txt reporting contact', () => {
  it('uses the private advisory form named by SECURITY.md', () => {
    const contact = fields.get('Contact')
    expect(contact).toMatch(/^https:\/\/github\.com\/[^/]+\/[^/]+\/security\/advisories\/new$/)
    expect(securityPolicy).toContain(contact)
  })

  it('declares an ISO 8601 expiry with at least 30 days remaining', () => {
    const expires = fields.get('Expires')
    const timestamp = Date.parse(expires)

    expect(expires).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/)
    expect(Number.isNaN(timestamp)).toBe(false)
    expect(timestamp - Date.now()).toBeGreaterThan(30 * 24 * 60 * 60 * 1000)
  })

  it('points to the public security policy and an English contact', () => {
    expect(fields.get('Policy')).toBe(
      'https://github.com/DivyashreeR008/Open-Agents/blob/main/SECURITY.md'
    )
    expect(fields.get('Preferred-Languages')).toBe('en')
  })

  it('stays within the RFC size limit and has no duplicate fields', () => {
    expect(Buffer.byteLength(securityTxt, 'utf8')).toBeLessThan(32 * 1024)
    expect(securityTxt.split(/\r?\n/).filter((line) => line.startsWith('Contact:')).length).toBe(1)
    expect(fields.size).toBe(4)
  })
})
