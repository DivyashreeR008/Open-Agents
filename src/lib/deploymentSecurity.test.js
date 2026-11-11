import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (file) => readFileSync(resolve(process.cwd(), file), 'utf8')

function deploymentHeaders() {
  const config = JSON.parse(read('vercel.json'))
  const rule = (config.headers || []).find((entry) => entry.source === '/(.*)')
  expect(rule, 'a global header rule must exist').toBeTruthy()
  return Object.fromEntries(rule.headers.map(({ key, value }) => [key, value]))
}

function directive(policy, name) {
  return policy
    .split(';')
    .map((part) => part.trim())
    .find((part) => part === name || part.startsWith(`${name} `))
}

describe('deployment security policy', () => {
  it('serves a content policy with a self-only default and no framing', () => {
    const policy = deploymentHeaders()['Content-Security-Policy']
    expect(policy).toBeTruthy()

    expect(directive(policy, 'default-src')).toBe("default-src 'self'")
    expect(directive(policy, 'script-src')).toBe("script-src 'self'")
    expect(directive(policy, 'object-src')).toBe("object-src 'none'")
    expect(directive(policy, 'frame-ancestors')).toBe("frame-ancestors 'none'")
    expect(directive(policy, 'base-uri')).toBe("base-uri 'self'")
    expect(directive(policy, 'form-action')).toBe("form-action 'self'")
  })

  it('allows only the provider and backend origins the application actually calls', () => {
    const policy = deploymentHeaders()['Content-Security-Policy']
    const connect = directive(policy, 'connect-src')
    expect(connect).toBeTruthy()

    const sources = connect.split(/\s+/).slice(1)
    expect(sources).toContain("'self'")
    expect(sources).toContain('https://api.openai.com')
    expect(sources).toContain('https://api.anthropic.com')
    expect(sources).toContain('https://generativelanguage.googleapis.com')
    expect(sources).toContain('https://openrouter.ai')
    expect(sources).toContain('https://*.supabase.co')
    expect(sources).toContain('wss://*.supabase.co')

    expect(sources).not.toContain('*')
    expect(sources).not.toContain('https:')
    for (const source of sources) {
      expect(source === "'self'" || /^(https|wss):\/\//.test(source)).toBe(true)
    }
  })

  it('sets the companion browser hardening headers', () => {
    const headers = deploymentHeaders()

    expect(headers['X-Content-Type-Options']).toBe('nosniff')
    expect(headers['X-Frame-Options']).toBe('DENY')
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['Permissions-Policy']).toContain('camera=()')
    expect(headers['Permissions-Policy']).toContain('geolocation=()')
    expect(headers['Permissions-Policy']).toContain('microphone=(self)')
    expect(headers['Strict-Transport-Security']).toMatch(/max-age=\d+/)
    expect(headers['Strict-Transport-Security']).toContain('includeSubDomains')
    expect(headers['Cross-Origin-Opener-Policy']).toBe('same-origin')
  })
})
