import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')

describe('first-paint document shell', () => {
  it('renders meaningful loading structure inside the application root', () => {
    const root = html.match(/<div id="root">([\s\S]*?)<\/div>\s*<noscript>/)
    expect(root).not.toBeNull()
    expect(root[1]).toContain('<h1>Open Agents</h1>')
    expect(root[1]).toContain('role="status"')
    expect(root[1]).toContain('Loading the agent workspace')
  })

  it('styles the shell inline so it does not wait for the bundle or stylesheet', () => {
    expect(html).toContain('.boot-shell')
    expect(html).toContain('prefers-color-scheme: dark')
    expect(html).toMatch(/<style>[\s\S]*\.boot-shell[\s\S]*<\/style>/)
  })

  it('explains the JavaScript requirement when scripting is disabled', () => {
    expect(html).toContain('<noscript>')
    expect(html).toMatch(/needs JavaScript enabled/)
  })
})
