import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

const SW_PATH = path.join(process.cwd(), 'public', 'sw.js')

describe('Service Worker Security and Caching Rules', () => {
  const swCode = fs.readFileSync(SW_PATH, 'utf8')

  it('sw.js exists in public/ directory', () => {
    expect(fs.existsSync(SW_PATH)).toBe(true)
  })

  it('sw.js precaches built static assets and app shell', () => {
    expect(swCode).toContain("'/index.html'")
    expect(swCode).toContain("'/site.webmanifest'")
    expect(swCode).toContain("'/favicon.svg'")
    expect(swCode).toContain("'/android-chrome-192x192.png'")
    expect(swCode).toContain("'/android-chrome-512x512.png'")
  })

  it('sw.js handles SKIP_WAITING message to allow user-driven updates', () => {
    expect(swCode).toContain("'SKIP_WAITING'")
    expect(swCode).toContain('self.skipWaiting()')
  })

  it('sw.js strictly refuses to cache non-GET requests', () => {
    expect(swCode).toMatch(/request\.method\s*!==\s*['"]GET['"]/)
  })

  it('sw.js explicitly blocks LLM provider hosts from caching', () => {
    const expectedBlockedHosts = [
      'openai.com',
      'anthropic.com',
      'googleapis.com',
      'openrouter.ai',
      'groq.com',
      'mistral.ai',
      'cohere.ai',
      'supabase.co',
    ]

    for (const host of expectedBlockedHosts) {
      expect(swCode).toContain(host)
    }
  })

  it('sw.js checks and forbids requests with authorization or API key headers', () => {
    expect(swCode).toContain("'authorization'")
    expect(swCode).toContain("'x-api-key'")
    expect(swCode).toContain("'api-key'")
  })

  it('sw.js restricts caching to same-origin built static assets', () => {
    expect(swCode).toContain('self.location.origin')
    expect(swCode).toContain("'/assets/'")
  })
})
