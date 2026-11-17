import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const guide = readFileSync('docs/STORAGE.md', 'utf8')

function sourceFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    if (statSync(path).isDirectory()) {
      if (path === 'src/agents' || path === 'src/test') return []
      return sourceFiles(path)
    }
    return /\.(js|jsx)$/.test(name) && !/\.test\./.test(name) ? [path] : []
  })
}

const ignoredLiterals = new Set(['oa_analytics_update'])

function storedKeys() {
  const keys = new Set()
  for (const file of sourceFiles('src')) {
    const source = readFileSync(file, 'utf8')
    for (const match of source.matchAll(
      /['"](oa_[a-z0-9_]+|OpenAgents_[a-z0-9_]+|recentAgents|sidebar-category-collapsed-state)['"]/g
    )) {
      if (!ignoredLiterals.has(match[1])) keys.add(match[1])
    }
  }
  return [...keys].sort()
}

describe('browser storage documentation', () => {
  it('documents every storage key used by application source', () => {
    const keys = storedKeys()
    expect(keys.length).toBeGreaterThan(20)
    for (const key of keys) {
      expect(guide, `${key} is missing from docs/STORAGE.md`).toContain(`\`${key}`)
    }
  })

  it('separates durable, session, IndexedDB, and third-party storage', () => {
    expect(guide).toContain('## `localStorage` keys')
    expect(guide).toContain('## `sessionStorage` keys')
    expect(guide).toContain('## IndexedDB')
    expect(guide).toContain('## Supabase and service worker storage')
    expect(guide).toContain('open-agents-secure-keystore')
    expect(guide).toContain('automation-vault-v2')
    expect(guide).toContain('sb-<project-ref>-auth-token')
  })

  it('states the expiry and migration rules for API keys', () => {
    expect(guide).toContain('eight-hour expiry')
    expect(guide).toContain('migrate a legacy value')
    expect(guide).toContain('oa_apikey_<provider>')
    expect(guide).toContain('oa_scheduler_key_<jobId>')
  })

  it('does not claim that the error-screen reset removes IndexedDB', () => {
    const resetSection = guide.slice(guide.indexOf('## Clearing browser data'))
    expect(resetSection).toContain('does not delete the IndexedDB device key')
    expect(resetSection).toContain('Clear site data')
  })
})
