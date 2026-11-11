import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (file) => readFileSync(resolve(process.cwd(), file), 'utf8')

describe('typography loading', () => {
  it('keeps font stylesheets and files off third-party origins', () => {
    const html = read('index.html')

    expect(html).not.toContain('fonts.googleapis.com')
    expect(html).not.toContain('fonts.gstatic.com')
    expect(html).not.toMatch(/<link[^>]+rel=["']preconnect["']/i)
  })

  it('registers every family from a locally installed font package', () => {
    const entry = read('src/main.jsx')
    const manifest = JSON.parse(read('package.json'))
    const families = [
      '@fontsource-variable/inter',
      '@fontsource-variable/inter-tight',
      '@fontsource-variable/jetbrains-mono',
    ]

    for (const family of families) {
      expect(entry).toContain(`'${family}'`)
      expect(manifest.dependencies[family]).toMatch(/^\^5\./)
    }
  })

  it('uses the variable family names in the design tokens', () => {
    const tokens = read('tailwind.config.js')

    expect(tokens).toContain("'Inter Variable'")
    expect(tokens).toContain("'Inter Tight Variable'")
    expect(tokens).toContain("'JetBrains Mono Variable'")
  })
})
